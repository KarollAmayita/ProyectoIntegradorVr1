# Conventional Commits

Este proyecto utiliza la especificación de **Conventional Commits** para mantener un historial de commits limpio y estructurado.

## Estructura del Commit

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[nota de pie opcional]
```

## Tipos de Commits

|Tipo|Descripción|Versión SemVer|
|----|-----------|-------------|
|`feat`|Nueva característica|MINOR|
|`fix`|Corrección de error|PATCH|
|`docs`|Cambios en documentación|-none-|
|`style`|Cambios de formato (no lógica)|-none-|
|`refactor`|Refactorización del código|INE|
|`perf`|Mejora de rendimiento|INE|
|`test`|Agregar o corregir tests|INE|
|`chore`|Tareas de mantenimiento|INE|
|`ci`|Cambios en configuración de CI|INE|
|`build`|Cambios en sistema de build|INE|

## Ejemplos

### Nueva característica
```
feat: agregar endpoint para crear noticias

- POST /api/news
- Validación de campos requeridos
- Retorna la noticia creada
```

### Corrección de bug
```
fix: corregir validación de contraseña

La contraseña no se validaba correctamente contra el hash.
Ahora usa bcrypt.compareSync para la comparación.
```

### Documentación
```
docs: actualizar README con instrucciones de instalación
```

### Cambio que rompe compatibilidad (MAJOR)
```
feat!: cambiar formato del token JWT

BREAKING CHANGE: el token ahora incluye tiempo de expiración.
Los clientes deben actualizar para manejar el nuevo formato.
```

### Con ámbito
```
feat(auth): agregar endpoint de logout

- Invalida el token del usuario
- Registra la fecha de logout
```

### Con referencia a issue
```
fix: corregir error al obtener países

Refs: #13
```

## ¿Por qué usar Conventional Commits?

- Generación automática de CHANGELOGs
- Determinación automática de versión (semver)
- Historial de commits legible y estructurado
- Facilita la contribución al proyecto

## Reglas rápidas

1. Usar minúsculas en el tipo
2.Descripción breve (máx 50 caracteres)
3. Usar imperativo: "agregar" no "agregado"
4. Cuerpo separado por una línea en blanco
5. footers: `Refs: #1`, `Closes: #2`

## Recursos

- [Especificación completa](https://www.conventionalcommits.org/)
- [SemVer](http://semver.org/)