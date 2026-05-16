const archivosRepository = require('../repositories/archivosRepository');
const supabase = require('../config/supabase');

const BUCKET_NAME = 'archivos';

const listar = async (params) => archivosRepository.findAll(params);
const obtener = async (id) => archivosRepository.findById(id);

const registrarUrl = async (payload, user) => {
  const { url, nombre, tipo = 'imagen', noticia_id, testimonio_id } = payload;
  if (!url || !nombre) throw new Error('URL y nombre son obligatorios');
  return archivosRepository.create({ url, nombre, tipo, noticia_id: noticia_id || null, testimonio_id: testimonio_id || null, subido_por: user.id });
};

const upload = async (file, metadata, user) => {
  if (!file) throw new Error('Archivo requerido');
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file.buffer, { contentType: file.mimetype });
  if (uploadError) throw new Error('Error al subir archivo: ' + uploadError.message);

  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  const publicUrl = urlData?.publicUrl || '';

  return archivosRepository.create({
    url: publicUrl, nombre: file.name, tipo: determinarTipo(file.mimetype),
    peso_bytes: file.size, storage_path: filePath, subido_por: user.id,
    noticia_id: metadata.noticia_id || null, testimonio_id: metadata.testimonio_id || null,
  });
};

const actualizar = async (id, payload, user) => {
  const existing = await archivosRepository.findById(id);
  if (!existing) throw new Error('Archivo no encontrado');
  return archivosRepository.update(id, { ...payload, updated_at: new Date().toISOString() });
};

const eliminar = async (id) => {
  const existing = await archivosRepository.findById(id);
  if (!existing) throw new Error('Archivo no encontrado');
  if (existing.storage_path) {
    await supabase.storage.from(BUCKET_NAME).remove([existing.storage_path]).catch(() => {});
  }
  await archivosRepository.remove(id);
  return { message: 'Archivo eliminado correctamente' };
};

const determinarTipo = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'imagen';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.startsWith('video/')) return 'video';
  return 'documento';
};

module.exports = { listar, obtener, registrarUrl, upload, actualizar, eliminar };
