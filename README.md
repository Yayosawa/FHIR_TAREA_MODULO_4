# FHIR Facade - TypeScript (Express)

FHIR R4 facade implementation using **Express 4.18** and **TypeScript 5.3** that transforms a legacy REST API into FHIR-compliant resources.

## 🎯 Educational Purpose

This project is designed for students to learn:
- Building REST APIs with Express and TypeScript
- Using TypeScript for type-safe FHIR resource manipulation
- Implementing the Facade pattern
- Converting legacy data to FHIR R4 format
- **Completing partially implemented functionality** (Patient and Practitioner endpoints)

## 📚 What's Inside

### ⚠️ Partially Implemented: Patient Endpoint

The Patient endpoint is **partially implemented** as a reference:

- `POST /Patient` - ✅ Create a new patient (FULLY IMPLEMENTED following FHIR R4 spec)
- `GET /Patient` - 🚧 TODO: Search for all patients (STUDENT EXERCISE)
- `GET /Patient/{id}` - 🚧 TODO: Read a specific patient by ID (STUDENT EXERCISE)

**Components:**
- [patient.controller.ts](src/controllers/patient.controller.ts) - Request handlers (CREATE implemented)
- [patient.service.ts](src/services/patient.service.ts) - Business logic (CREATE implemented)
- [patient.mapper.ts](src/mappers/patient.mapper.ts) - FHIR ↔ Legacy conversion (both directions)

**Student Task:** Implement the missing GET operations following the Practitioner GET pattern.

### ⚠️ Partially Implemented: Practitioner Endpoint

The Practitioner endpoint is **partially implemented** as a reference:

- `GET /Practitioner` - ✅ Search for all practitioners (FULLY IMPLEMENTED)
- `GET /Practitioner/{id}` - ✅ Read a specific practitioner by ID (FULLY IMPLEMENTED)
- `POST /Practitioner` - 🚧 TODO: Create a new practitioner (STUDENT EXERCISE)

**Components:**
- [practitioner.controller.ts](src/controllers/practitioner.controller.ts) - Request handlers (GET operations implemented)
- [practitioner.service.ts](src/services/practitioner.service.ts) - Business logic (GET operations implemented)
- [practitioner.mapper.ts](src/mappers/practitioner.mapper.ts) - FHIR ↔ Legacy conversion (both directions, FULLY IMPLEMENTED)

**Student Task:** Implement the missing CREATE operation following the Patient CREATE pattern.

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────>│ FHIR Facade  │─────>│  Legacy API │
│  (FHIR R4)  │<─────│  (Express/TS)│<─────│  (REST API) │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ├── Routes (Express routers)
                            ├── Controllers (Request handlers)
                            ├── Services (Business logic)
                            ├── Mappers (Legacy → FHIR)
                            └── Client (Legacy API calls)
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose

### Run with Docker Compose

This project includes a complete `docker-compose.yml` that starts all necessary services:

- **PostgreSQL Database** - Database with schema and initial data
- **Legacy API** - Python/FastAPI API with sample data
- **FHIR Facade TypeScript** - Express application that transforms the legacy API to FHIR R4

1. **Start all services** (from the `facade-ts` directory):
   ```bash
   docker-compose up -d
   ```

2. **Verify services are running**:
   ```bash
   docker-compose ps
   ```

3. **View logs** (optional):
   ```bash
   # All services
   docker-compose logs -f

   # TypeScript facade only
   docker-compose logs -f fhir-facade-ts
   ```

4. **Available services**:
   - FHIR Facade TypeScript: `http://localhost:3000/baseR4`
   - Swagger UI (API Documentation): `http://localhost:3000/baseR4/docs`
   - OpenAPI JSON: `http://localhost:3000/baseR4/openapi`
   - FHIR Metadata: `http://localhost:3000/baseR4/metadata`
   - Legacy API: `http://localhost:8000`
   - PostgreSQL: `localhost:5432`

5. **Stop all services**:
   ```bash
   docker-compose down
   ```

6. **Rebuild after code changes**:
   ```bash
   docker-compose down
   docker-compose build fhir-facade-ts
   docker-compose up -d
   ```

### Test the Metadata Endpoint

```bash
# FHIR metadata/capabilities
curl http://localhost:3000/baseR4/metadata
```

### 📖 API Documentation (Swagger UI)

**Interactive API Documentation**: The facade includes comprehensive OpenAPI 3.0 documentation with Swagger UI.

- **Swagger UI**: `http://localhost:3000/baseR4/docs`
  - Interactive API explorer
  - Try out endpoints directly from the browser
  - See all request/response schemas
  - View implementation status (✅ Implemented vs 🚧 Exercise)

- **OpenAPI JSON**: `http://localhost:3000/baseR4/openapi`
  - Raw OpenAPI specification
  - Can be imported into Postman, Insomnia, etc.

**Features**:
- Complete FHIR R4 schema definitions
- Chilean healthcare context (RUT, RNPI identifiers)
- Educational annotations showing which endpoints are exercises
- Request/response examples for all operations
- Parameter descriptions (TOKEN search, Prefer header, etc.)

## 🔍 FHIR Search Parameters

This implementation demonstrates **FHIR R4 Token Search** on the Practitioner resource.

### Token Search Semantics

Per [FHIR R4 Search specification](https://hl7.org/fhir/R4/search.html#token), token search parameters support two formats:

1. **Value only**: `?identifier=[value]`
   - Matches any system with the specified value
   - Example: `?identifier=12345`

2. **System|Value**: `?identifier=[system]|[value]`
   - Matches only when both system and value match
   - Example: `?identifier=https://www.superintendenciadesalud.gob.cl/rnpi|12345`

### Implemented Search Parameter

#### ✅ `identifier` (Supported)

Search practitioners by identifier (RNPI).

```bash
# Search by value only
curl "http://localhost:3000/baseR4/Practitioner?identifier=12345"

# Search with system qualifier
curl "http://localhost:3000/baseR4/Practitioner?identifier=https://www.superintendenciadesalud.gob.cl/rnpi|12345"
```

**Implementation Details:**
- Token type search (exact match)
- Searches RNPI field from legacy database
- System: `https://www.superintendenciadesalud.gob.cl/rnpi`
- See [practitioner.service.ts](src/services/practitioner.service.ts) for implementation

## 📊 Implementation Status

### Patient Endpoints
- ✅ `POST /Patient` - Create a new patient (FULLY IMPLEMENTED)
- 🚧 `GET /Patient` - Search for all patients (NOT IMPLEMENTED - Returns 501)
- 🚧 `GET /Patient/{id}` - Read a specific patient by ID (NOT IMPLEMENTED - Returns 501)

### Practitioner Endpoints
- ✅ `GET /Practitioner` - Search for all practitioners (FULLY IMPLEMENTED)
- ✅ `GET /Practitioner/{id}` - Read a specific practitioner by ID (FULLY IMPLEMENTED)
- ✅ `GET /Practitioner?identifier={value}` - Search by identifier (FULLY IMPLEMENTED)
- 🚧 `POST /Practitioner` - Create a new practitioner (NOT IMPLEMENTED - Returns 501)

## 📋 Legacy API Reference

### Patients Endpoints

**GET /api/Paciente**
- Returns all patients

**POST /api/Paciente**
```json
{
  "rut": "12345678-9",
  "nombre": "María",
  "apellido_paterno": "González",
  "apellido_materno": "Pérez",
  "nacimiento": "1990-05-15",
  "telefono": "+56912345678",
  "email": "maria@example.com"
}
```

### Doctors Endpoints (for Practitioner)

**GET /api/Medico**
```json
[
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
]
```

**POST /api/Medico**
```json
{
  "rnpi": "12345",
  "nombre": "Juan",
  "apellido_paterno": "García",
  "apellido_materno": "López",
  "telefono": "+56912345678",
  "email": "juan.garcia@hospital.cl",
  "especialidad_id": 1
}
```

## 🎓 Learning Objectives

By completing this exercise, students will learn:

1. **Express + TypeScript Development**
   - Request handlers, Services, and Dependency Injection
   - RESTful endpoint design with Express Router
   - Error handling with OperationOutcome

2. **TypeScript FHIR Types**
   - Creating FHIR resources (Patient, Practitioner)
   - Building FHIR Bundles
   - Using FHIR data types (HumanName, Identifier, ContactPoint, etc.)

3. **FHIR R4 Specification**
   - CREATE interaction (Location header, Prefer header, ID handling)
   - READ interaction (single resource retrieval)
   - SEARCH interaction (Bundle responses)
   - Token search parameters (identifier)
   - CapabilityStatement for server capabilities

4. **Data Transformation**
   - Bi-directional mapping (FHIR ↔ Legacy)
   - Handling different data structures
   - Type conversions and validation

5. **Design Patterns**
   - Facade pattern
   - Mapper pattern
   - Service layer pattern
   - Array filtering and functional programming

## 📚 Resources

- [FHIR R4 Documentation](https://www.hl7.org/fhir/)
- [FHIR R4 Practitioner](https://www.hl7.org/fhir/practitioner.html)
- [Express Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🐛 Troubleshooting

### Port already in use
```bash
docker-compose down
docker-compose up -d
```

### Changes not reflecting
```bash
docker-compose build fhir-facade-ts
docker-compose up -d fhir-facade-ts
```

### Check logs
```bash
docker-compose logs -f fhir-facade-ts
```

## 📄 License

MIT - Educational Project
