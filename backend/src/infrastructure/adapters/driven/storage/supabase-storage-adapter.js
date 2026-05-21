const supabase = require('../../../../config/supabase');

class SupabaseStorageAdapter {
  constructor() {
    this.BUCKET_NAME = 'archivos';
  }

  async upload(file, path) {
    const { error: uploadError } = await supabase.storage.from(this.BUCKET_NAME).upload(path, file.buffer, { contentType: file.mimetype });
    if (uploadError) throw new Error('Error al subir archivo: ' + uploadError.message);

    const { data: urlData } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(path);
    const publicUrl = urlData?.publicUrl || '';

    return { filePath: path, publicUrl };
  }

  async remove(path) {
    const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([path]);
    if (error) throw new Error('Error al eliminar archivo: ' + error.message);
  }
}

module.exports = SupabaseStorageAdapter;
