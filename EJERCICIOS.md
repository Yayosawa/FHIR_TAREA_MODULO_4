# Ejercicios para Estudiantes - FHIR Facade TypeScript

## 📋 Resumen de Ejercicios

Este documento describe los ejercicios que deben completar para el proyecto FHIR Facade TypeScript.

## 🚀 Configuración del Entorno

### Prerrequisitos

- Docker y Docker Compose instalados

### Iniciar el Entorno

El proyecto incluye un `docker-compose.yml` que levanta **todos los servicios** necesarios automáticamente:

```bash
# Desde el directorio facade-ts
cd facade-ts

# Iniciar todos los servicios (base de datos, legacy API, y facade TypeScript)
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps

# Ver logs
docker-compose logs -f fhir-facade-ts
```

### Servicios Disponibles

Una vez iniciado, tendrás acceso a:

- **FHIR Facade TypeScript**: http://localhost:3000/baseR4
- **Swagger UI**: http://localhost:3000/docs
- **Legacy API**: http://localhost:8000
- **Base de Datos PostgreSQL**: localhost:5432

### Comandos Útiles

```bash
# Reconstruir después de cambios en el código
docker-compose down
docker-compose build fhir-facade-ts
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f fhir-facade-ts

# Detener todos los servicios
docker-compose down

# Limpiar volúmenes (elimina datos de la BD)
docker-compose down -v
```

---

## 📚 Estado de Implementación

| Recurso | CREATE | GET (Búsqueda) | GET (Por ID) | Búsqueda por Parámetros |
|---------|--------|----------------|--------------|-------------------------|
| **Patient** | ✅ **IMPLEMENTADO** | 🚧 **EJERCICIO 1** | 🚧 **EJERCICIO 1** | 🚧 **EJERCICIO 3** (family) |
| **Practitioner** | 🚧 **EJERCICIO 2** | ✅ **IMPLEMENTADO** | ✅ **IMPLEMENTADO** | ✅ identifier |

---

## 🎯 Ejercicio 1: Completar Operaciones GET de Patient

### Objetivo

Implementar las operaciones de búsqueda y lectura por ID para el recurso Patient, siguiendo los patrones ya implementados en Practitioner.

### Lo que ya tienes disponible

#### ✅ Implementado y disponible para usar:
- `patientMapper.toFhir(legacyPatient)` - Transforma datos legacy a FHIR Patient
- `patientMapper.toLegacy(patient)` - Transforma FHIR Patient a legacy
- `legacyApiClient.createPatient(data)` - Crea paciente en API legacy
- `patientService.createPatient(patient)` - Lógica de creación
- `patientController.createPatient()` - Endpoint POST /Patient (ejemplo de referencia)

#### 📚 Código de referencia (implementación completa):
- `practitionerController.searchPractitioners()` - GET /Practitioner
- `practitionerController.getPractitioner(id)` - GET /Practitioner/{id}
- `practitionerService.searchPractitioners(identifier)` - Búsqueda con filtros
- `practitionerService.getPractitionerById(id)` - Obtener por ID
- `practitionerMapper.toBundle(doctors)` - Crear Bundle FHIR

### Tareas

#### Tarea 1.1: Implementar GET /Patient (Búsqueda)

**Archivos a modificar:**
- `src/controllers/patient.controller.ts` - Reemplazar método `searchPatients()`
- `src/services/patient.service.ts` - Implementar método `searchPatients()`
- `src/mappers/patient.mapper.ts` - Implementar método `toBundle()`
- `src/services/legacy-api.client.ts` - Ya tiene método `getPatients()`

**Requisitos:**
- Debe retornar un Bundle de tipo `searchset`
- Debe incluir el total de resultados
- Cada entrada debe tener `fullUrl` y `search.mode = match`
- Manejar errores con OperationOutcome

**Hints:**
- El endpoint legacy es `GET /api/Paciente`
- El método `getPatients()` ya existe en `legacy-api.client.ts`
- El Bundle debe tener tipo `searchset`
- Revisa cómo lo hace `practitionerController.searchPractitioners()`
- Sigue el mismo patrón: validar _format, llamar al service, retornar Bundle
- Usa `req.query._format as string | undefined` para el parámetro
- Helper methods `isJsonFormat()` y `createOperationOutcome()` ya existen

#### Tarea 1.2: Implementar GET /Patient/{id} (Lectura por ID)

**Archivos a modificar:**
- `src/controllers/patient.controller.ts` - Reemplazar método `getPatient()`
- `src/services/patient.service.ts` - Implementar método `getPatientById()`
- `src/services/legacy-api.client.ts` - Implementar método `getPatient(id)`

**Requisitos:**
- Debe retornar un recurso Patient individual
- Retornar 404 si no se encuentra
- Manejar errores con OperationOutcome

**Hints:**
- La API legacy NO tiene endpoint directo `GET /api/Paciente/{id}`
- Debes obtener todos y filtrar por ID (como lo hace Practitioner)
- Usa `.find()` para filtrar: `patients.find(p => String(p.id) === id)`
- Revisa `practitionerController.getPractitioner()` para ver el patrón completo
- Extrae ID con `req.params.id`
- Retorna 404 con OperationOutcome si no existe

### Verificación

```bash
# Reconstruir
docker-compose build fhir-facade-ts
docker-compose up -d fhir-facade-ts

# Probar búsqueda
curl http://localhost:3000/baseR4/Patient

# Probar lectura por ID
curl http://localhost:3000/baseR4/Patient/1

# Probar 404
curl http://localhost:3000/baseR4/Patient/999
```

---

## 🎯 Ejercicio 2: Implementar Operación CREATE de Practitioner

### Objetivo

Implementar la operación de creación para el recurso Practitioner, siguiendo la especificación FHIR R4 y el patrón ya implementado en Patient.

### Lo que ya tienes disponible

#### ✅ Implementado y disponible para usar:
- `practitionerMapper.toFhir(legacyDoctor)` - Transforma legacy a FHIR
- `practitionerMapper.toLegacy(practitioner)` - Transforma FHIR a legacy ⭐
- `legacyApiClient.createDoctor(data)` - Crea en API legacy ⭐
- `practitionerService.searchPractitioners(identifier)` - Búsqueda
- `practitionerService.getPractitionerById(id)` - Lectura por ID

#### 📚 Código de referencia (implementación completa):
- `patientController.createPatient()` - POST /Patient (FHIR R4 compliant)
- `patientService.createPatient(patient)` - Lógica de creación

### Tarea

#### Implementar POST /Practitioner

**Archivos a modificar:**
- `src/controllers/practitioner.controller.ts` - Reemplazar método `createPractitioner()`
- `src/services/practitioner.service.ts` - Implementar método `createPractitioner()`

**Requisitos FHIR R4:**
- ✅ Ignorar el ID proporcionado en el request (`delete practitioner.id`)
- ✅ Retornar 201 Created con header `Location: /baseR4/Practitioner/{id}`
- ✅ Soportar header `Prefer`:
  - `return=minimal` → 201 solo con Location, sin body
  - `return=representation` o sin header → 201 con Location + recurso completo
- ✅ Manejar errores de parseo con 400 Bad Request
- ✅ Content-Type: `application/fhir+json`

**Hints:**
- Extrae el practitioner del `req.body`
- El método `practitionerMapper.toLegacy()` ya está implementado
- El método `legacyApiClient.createDoctor()` ya está implementado
- Revisa `patientController.createPatient()` - tiene toda la lógica FHIR R4
- Usa `req.get('Prefer')` para obtener el header Prefer
- Construye Location: `` `/baseR4/Practitioner/${created.id}` ``
- Helper methods `isJsonFormat()` y `createOperationOutcome()` ya existen
- Captura errores que contengan 'parse' o 'invalid' para 400 Bad Request

**Flujo esperado:**
1. Obtener FHIR Practitioner del request body
2. Remover ID (FHIR spec)
3. Llamar a `practitionerService.createPractitioner(practitioner)`
4. Construir URL de Location
5. Verificar header Prefer
6. Retornar respuesta apropiada

### Verificación

```bash
# Reconstruir
docker-compose build fhir-facade-ts
docker-compose up -d fhir-facade-ts

# Crear practitioner (debe retornar 201 + Location + body)
curl -i -X POST http://localhost:3000/baseR4/Practitioner \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Practitioner",
    "identifier": [{
      "system": "https://www.superintendenciadesalud.gob.cl/rnpi",
      "value": "99999"
    }],
    "name": [{
      "family": "García López",
      "given": ["Juan"]
    }],
    "telecom": [
      {"system": "phone", "value": "+56912345678"},
      {"system": "email", "value": "juan@hospital.cl"}
    ],
    "qualification": [{
      "code": {
        "coding": [{
          "system": "http://example.org/especialidades",
          "code": "1"
        }]
      }
    }]
  }'

# Con Prefer: return=minimal (debe retornar 201 + Location, sin body)
curl -i -X POST http://localhost:3000/baseR4/Practitioner \
  -H "Content-Type: application/fhir+json" \
  -H "Prefer: return=minimal" \
  -d '{ ... mismo body ... }'
```

---

## 🎯 Ejercicio 3: Implementar Búsqueda por Parámetro family en Patient

### Objetivo

Implementar búsqueda por parámetro `family` (string search) para el recurso Patient, siguiendo el patrón de búsqueda por `identifier` implementado en Practitioner.

### Contexto

En FHIR R4, `family` es un parámetro de búsqueda de tipo **STRING** que busca por apellido en el recurso Patient. Ya existe una implementación completa de búsqueda con parámetros en `practitionerController.searchPractitioners(identifier)` que pueden usar como referencia.

### Lo que ya tienes disponible

#### ✅ Implementado y disponible como referencia:
- `practitionerController.searchPractitioners()` - Búsqueda con token search
- `practitionerService.searchPractitioners(identifier)` - Lógica de filtrado por token
- `practitionerService.matchesIdentifier()` - Parsing de token search

#### 📚 Especificación FHIR:
- **Family** es un parámetro de tipo STRING
- Busca por apellido (family name) del paciente
- Soporta búsqueda parcial (contiene) y case-insensitive
- Formato de búsqueda: `?family=García` o `?family=garcia`

### Tarea

#### Implementar búsqueda por family en Patient

**Archivos a modificar:**
- `src/controllers/patient.controller.ts` - Modificar `searchPatients()` para aceptar parámetro `family`
- `src/services/patient.service.ts` - Modificar método de búsqueda para filtrar por `family`
- `src/routes/index.ts` - Agregar parámetro de búsqueda `family` al CapabilityStatement

**Requisitos FHIR R4:**
- ✅ Aceptar parámetro `?family=García` (apellido del paciente)
- ✅ String search con búsqueda parcial (contains) y case-insensitive
- ✅ Retornar Bundle con pacientes que contengan el texto en su apellido
- ✅ Si no hay parámetro, retornar todos (comportamiento actual)
- ✅ Declarar en CapabilityStatement

**Hints:**

1. **String Search para Family:**
   - Family es un parámetro de tipo STRING (no TOKEN como identifier)
   - Búsqueda parcial: debe encontrar "García" si busco "gar" o "GAR"
   - Case-insensitive: "garcía" debe encontrar "García"
   - Match por contención (includes), no exacto

2. **Verificar campo en API Legacy:**
   ```bash
   # Revisar estructura de pacientes en API legacy
   curl http://localhost:8000/api/Paciente
   # Verás: apellido_paterno y apellido_materno
   ```

3. **Patrón de implementación:**
   - Agregar `req.query.family as string | undefined` en el controller
   - Modificar `patientService.searchPatients(family)` para aceptar parámetro family
   - Filtrar la lista con `.filter()`
   - Usar `.toLowerCase()` y `.includes()` para búsqueda parcial case-insensitive

4. **Referencia de código:**
   - Ver `practitionerController.searchPractitioners()` para el patrón completo
   - Ver `practitionerService.searchPractitioners()` para el filtrado
   - **Diferencia clave:** Family es STRING (contiene/parcial), identifier es TOKEN (exacto)

5. **Mapeo FHIR ↔ Legacy:**
   - En FHIR: `patient.name[0].family` contiene ambos apellidos ("García López")
   - En legacy: `apellido_paterno` + " " + `apellido_materno`
   - La búsqueda debe buscar en el family name completo
   - Ejemplo: buscar "lópez" debe encontrar paciente con family="García López"

### Estructura de Datos

**Estructura en la API legacy:**

```json
{
  "id": 1,
  "rut": "12345678-9",
  "nombre": "Juan",
  "apellido_paterno": "Pérez",
  "apellido_materno": "González",
  "nacimiento": "1990-01-15",
  "telefono": "+56912345678",
  "email": "juan@example.com"
}
```

**Mapeo legacy → FHIR en PatientMapper:**
- Legacy: `apellido_paterno` + " " + `apellido_materno`
- FHIR: `patient.name[0].family = "Pérez González"`
- La búsqueda debe comparar contra el family name completo

### Actualizar CapabilityStatement

**Archivo:** `src/routes/index.ts`

Agregar el parámetro de búsqueda family en la sección de Patient del `/metadata` endpoint.
Buscar la sección de Patient en `router.get('/metadata')` y modificar `searchParam`:

```typescript
searchParam: [
  {
    name: '_id',
    type: 'token',
    documentation: 'Search by Patient ID'
  },
  {
    name: 'family',
    type: 'string',
    documentation: 'Search by family name (apellido). String search with partial match and case-insensitive. Example: ?family=garcía'
  }
]
```

### Verificación

```bash
# 1. Verificar estructura de datos legacy
curl http://localhost:8000/api/Paciente | jq

# 2. Reconstruir
docker-compose build fhir-facade-ts
docker-compose up -d fhir-facade-ts

# 3. Probar sin filtro
curl "http://localhost:3000/baseR4/Patient"

# 4. Probar con filtro family exacto
curl "http://localhost:3000/baseR4/Patient?family=García"

# 5. Probar con filtro family parcial (case-insensitive)
curl "http://localhost:3000/baseR4/Patient?family=gar"

# 6. Verificar en metadata
curl http://localhost:3000/baseR4/metadata | jq '.rest[0].resource[] | select(.type=="Patient") | .searchParam'

# 7. Probar búsqueda por apellido materno
curl "http://localhost:3000/baseR4/Patient?family=lópez"
```

### Notas Importantes

💡 **Búsqueda STRING vs TOKEN:**

- **STRING search** (family): Búsqueda parcial, case-insensitive, por contención
  - Ejemplo: `?family=gar` encuentra "García", "García López", "Algarve"

- **TOKEN search** (identifier): Búsqueda exacta, case-sensitive
  - Ejemplo: `?identifier=12345` solo encuentra exactamente "12345"

### Diferencias clave: identifier vs family

| Aspecto | identifier (Practitioner) | family (Patient) |
|---------|---------------------------|------------------|
| **Tipo** | TOKEN | STRING |
| **Formato** | `system\|value` o `value` | `value` solamente |
| **Sistema** | Sí (RNPI system) | No aplica |
| **Búsqueda** | Exacta (exact match) | Parcial (includes) |
| **Case Sensitivity** | Case-sensitive | Case-insensitive |
| **Parsing** | Más complejo (split por \|) | Simple (toLowerCase + includes) |
| **Ejemplo** | `?identifier=12345` | `?family=garcía` |

---

## 📚 Recursos de Referencia

### Código Implementado (para consultar)

| Ejercicio | Archivo de Referencia | Qué Contiene |
|-----------|----------------------|--------------|
| **Ejercicio 1** | `practitioner.controller.ts` | Métodos GET completos (search y read by ID) |
| **Ejercicio 1** | `practitioner.service.ts` | Lógica de búsqueda y lectura |
| **Ejercicio 1** | `practitioner.mapper.ts` | Método toBundle() implementado |
| **Ejercicio 2** | `patient.controller.ts` | CREATE completo con FHIR R4 compliance |
| **Ejercicio 2** | `patient.service.ts` | Método createPatient() completo |
| **Ejercicio 3** | `practitioner.controller.ts` | searchPractitioners con identifier (TOKEN search) |
| **Ejercicio 3** | `practitioner.service.ts` | Implementación de token search y filtering |
| **Ejercicio 3** | `routes/index.ts` | Ejemplo de declaración de search param en metadata |

### Documentación Externa

- [FHIR R4 RESTful API](https://www.hl7.org/fhir/http.html) - Especificación de operaciones
- [FHIR R4 Bundle](https://www.hl7.org/fhir/bundle.html) - Estructura de Bundle
- [FHIR R4 Search - Token](https://www.hl7.org/fhir/search.html#token) - Especificación de token search
- [FHIR R4 Search - String](https://www.hl7.org/fhir/search.html#string) - Especificación de string search
- [FHIR R4 Patient](https://www.hl7.org/fhir/patient.html) - Recurso Patient y sus parámetros de búsqueda
- [Express Request](https://expressjs.com/en/4x/api.html#req) - Documentación de Request
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 🔧 API Legacy - Endpoints Disponibles

### Pacientes
- `GET /api/Paciente` - Retorna todos los pacientes
- `POST /api/Paciente` - Crea un paciente
- NO existe `GET /api/Paciente/{id}` - debes filtrar del listado

### Médicos (Practitioners)
- `GET /api/Medico` - Retorna todos los médicos
- `POST /api/Medico` - Crea un médico
- NO existe `GET /api/Medico/{id}` - debes filtrar del listado

### Estructura de Datos Legacy

**Paciente:**
```json
{
  "id": 1,
  "rut": "12345678-9",
  "nombre": "Juan",
  "apellido_paterno": "Pérez",
  "apellido_materno": "González",
  "nacimiento": "1990-01-15",
  "telefono": "+56912345678",
  "email": "juan@example.com"
}
```

**Médico:**
```json
{
  "id": 1,
  "rnpi": "12345",
  "nombre": "María",
  "apellido_paterno": "García",
  "apellido_materno": "López",
  "telefono": "+56987654321",
  "email": "maria@hospital.cl",
  "especialidad_id": 1,
  "especialidades": [
    {
      "id": 1,
      "nombre": "Cardiología"
    }
  ]
}
```

---

## 🐛 Solución de Problemas

```bash
# Ver logs
docker-compose logs -f fhir-facade-ts

# Reconstruir si hay cambios en código
docker-compose build fhir-facade-ts
docker-compose up -d fhir-facade-ts

# Reiniciar todo
docker-compose down
docker-compose up -d

# Verificar que el servicio está corriendo
curl http://localhost:3000/baseR4/metadata
```

---

## ✅ Criterios de Evaluación

### Funcionalidad (60%)
- El código compila sin errores TypeScript
- Los endpoints responden correctamente
- Se manejan los casos de error (404, 400, 500)
- Las respuestas cumplen con el formato FHIR

### Cumplimiento FHIR R4 (25%)
- Bundles formateados según especificación
- OperationOutcome para errores
- Headers correctos (Location, Content-Type)
- Soporte de Prefer header (Ejercicio 2)

### Calidad del Código (15%)
- Código limpio y consistente con el estilo existente
- Reutilización de patrones implementados
- Manejo apropiado de excepciones
- Nombres de métodos y variables descriptivos
- Uso correcto de TypeScript (tipos, async/await)

---

## 💡 Consejos

1. **Lee el código de referencia primero** - Entiende cómo está implementado antes de escribir
2. **Sigue los patrones existentes** - No reinventes la rueda
3. **Prueba incrementalmente** - No esperes a terminar todo para probar
4. **Usa los logs** - Son tu mejor amigo para debugging
5. **FHIR es estricto** - Presta atención a los detalles de la especificación
6. **TypeScript ayuda** - Aprovecha los tipos y el autocompletado del IDE

---

## 📞 Entrega

Una vez completados los tres ejercicios:

1. ✅ Verifica que todos los tests manuales pasen
2. ✅ Revisa que tu código sigue los patrones establecidos
3. ✅ Asegúrate de que no haya errores de compilación TypeScript
4. ✅ Prueba los endpoints con curl o Postman
5. ✅ Verifica el metadata endpoint: `GET /baseR4/metadata`

**¡Éxito!** 🚀
