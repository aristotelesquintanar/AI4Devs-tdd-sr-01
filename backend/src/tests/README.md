# 🧪 Tests Unitarios - Funcionalidad de Insertar Candidatos

## 📋 Descripción

Este directorio contiene todos los tests unitarios para la funcionalidad de **insertar candidatos en base de datos**. Los tests están organizados por capas de la arquitectura y cubren tanto el flujo exitoso como los casos de error.

## 🏗️ Estructura de Tests

```
tests/
├── README.md                    # Esta documentación
├── setup.ts                     # Configuración global de Jest
├── tests-iniciales.test.ts      # Archivo principal que integra todos los tests
└── unit/                        # Tests unitarios por capa
    ├── validator.test.ts        # Tests para validación de datos
    ├── models.test.ts           # Tests para modelos de dominio
    ├── services.test.ts         # Tests para servicios de aplicación
    ├── controllers.test.ts      # Tests para controladores
    └── fileUpload.test.ts       # Tests para upload de archivos
```

## 🎯 Cobertura de Tests

### 1. **Validación de Datos** (`validator.test.ts`)
- ✅ Validación de nombres (con acentos, longitud, caracteres)
- ✅ Validación de emails (formato, dominio)
- ✅ Validación de teléfonos españoles (formato 6/7/9 + 8 dígitos)
- ✅ Validación de direcciones (longitud máxima)
- ✅ Validación de educación (institución, título, fechas)
- ✅ Validación de experiencia laboral (empresa, posición, descripción)
- ✅ Validación de CV (filePath, fileType)
- ❌ Casos de error para cada validación

### 2. **Modelos de Dominio** (`models.test.ts`)
- ✅ **Candidate**: Constructor, save(), findOne()
- ✅ **Education**: Constructor, save()
- ✅ **WorkExperience**: Constructor, save()
- ✅ **Resume**: Constructor, save(), create()
- ❌ Casos de error de base de datos
- ❌ Casos de email duplicado

### 3. **Servicios de Aplicación** (`services.test.ts`)
- ✅ Creación de candidato sin relaciones
- ✅ Creación de candidato con educación
- ✅ Creación de candidato con experiencia laboral
- ✅ Creación de candidato con CV
- ✅ Creación de candidato completo
- ✅ Manejo de múltiples educaciones/experiencias
- ❌ Manejo de errores de validación
- ❌ Manejo de errores de base de datos

### 4. **Controladores** (`controllers.test.ts`)
- ✅ Respuestas HTTP correctas (201, 400, 500)
- ✅ Manejo de request body
- ✅ Manejo de errores de servicios
- ✅ Casos con diferentes tipos de datos

### 5. **Upload de Archivos** (`fileUpload.test.ts`)
- ✅ Subida exitosa de PDF
- ✅ Subida exitosa de DOCX
- ❌ Rechazo de archivos inválidos
- ❌ Manejo de errores de Multer
- ❌ Manejo de errores generales

## 🚀 Ejecutar Tests

### Ejecutar todos los tests
```bash
cd backend
npm test
```

### Ejecutar tests específicos
```bash
# Solo tests de validación
npm test -- validator.test.ts

# Solo tests de modelos
npm test -- models.test.ts

# Solo tests de servicios
npm test -- services.test.ts

# Solo tests de controladores
npm test -- controllers.test.ts

# Solo tests de upload
npm test -- fileUpload.test.ts
```

### Ejecutar con coverage
```bash
npm test -- --coverage
```

### Ejecutar en modo watch
```bash
npm test -- --watch
```

## 📊 Estadísticas

- **Total de tests**: ~95 tests unitarios
- **Cobertura estimada**: >90%
- **Archivos testeados**: 8 archivos principales
- **Casos de uso cubiertos**: 15+ escenarios

## 🔧 Configuración

### Jest Configuration (`jest.config.js`)
- ✅ TypeScript support con `ts-jest`
- ✅ Coverage reporting
- ✅ Mock setup automático
- ✅ Timeout de 10 segundos

### Mocks Configurados
- ✅ Prisma Client (base de datos)
- ✅ Multer (upload de archivos)
- ✅ Express Request/Response
- ✅ Servicios de aplicación

## 🎯 Casos de Uso Cubiertos

### ✅ Flujo Exitoso
1. **Recepción de datos del formulario**
   - Validación de campos obligatorios
   - Validación de formatos (email, teléfono, fechas)
   - Validación de relaciones (educación, experiencia, CV)

2. **Guardado en base de datos**
   - Creación del candidato principal
   - Creación de registros de educación
   - Creación de registros de experiencia laboral
   - Creación de registro de CV
   - Asignación correcta de foreign keys

### ❌ Casos de Error
1. **Datos inválidos**
   - Nombres con caracteres especiales
   - Emails mal formateados
   - Teléfonos inválidos
   - Fechas incorrectas

2. **Errores de base de datos**
   - Email duplicado
   - Error de conexión
   - Error de constraint

3. **Errores de archivos**
   - Tipos de archivo no permitidos
   - Archivos muy grandes
   - Errores de upload

## 🛠️ Mantenimiento

### Agregar nuevos tests
1. Crear archivo en `unit/` con nombre `[componente].test.ts`
2. Importar en `tests-iniciales.test.ts`
3. Ejecutar tests para verificar

### Actualizar mocks
1. Modificar `setup.ts` para nuevos mocks
2. Actualizar tests existentes si es necesario
3. Verificar que todos los tests pasen

## 📝 Notas Importantes

- Todos los tests son **unitarios puros** con mocks
- No se requiere base de datos real para ejecutar tests
- Los tests están en español para mejor comprensión
- Se incluyen casos edge y de error
- Cobertura completa del flujo de inserción

## 🎉 Resultado Esperado

Al ejecutar `npm test`, deberías ver:
- ✅ Todos los tests pasando (verde)
- ✅ Cobertura >90%
- ✅ Sin errores de TypeScript
- ✅ Mocks funcionando correctamente 