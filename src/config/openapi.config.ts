/**
 * OpenAPI 3.0 Configuration for FHIR Facade API - TypeScript
 *
 * This configuration mirrors the Java facade's OpenApiConfig.java
 * Swagger UI available at: /baseR4/docs
 * OpenAPI JSON available at: /baseR4/openapi
 *
 * @author Roberto Araneda Espinoza
 */

export const openApiConfig = {
  openapi: '3.0.3',
  info: {
    title: 'FHIR R4 Facade API - TypeScript',
    version: '1.0.0',
    description: `FHIR R4-compliant RESTful API for Chilean Medical Appointments System.

This facade wraps a legacy Chilean medical appointments API and transforms the data
to FHIR R4 standard format, enabling healthcare interoperability.

## Chilean Healthcare Standards

- **RUT Identifier**: Chilean national ID mapped to FHIR identifier system
- **RNPI Identifier**: Chilean practitioner registry number
- **Two-Surname Names**: Chilean naming convention (apellido paterno + materno)

## Implementation Status

- ✅ **Patient CREATE** (POST /Patient) - Fully implemented as reference
- ✅ **Practitioner GET operations** (GET /Practitioner, GET /Practitioner/{id}) - Fully implemented as reference
- ✅ **Metadata** endpoint returns FHIR CapabilityStatement
- 📝 **Patient GET operations** - Student Exercise 1
- 📝 **Practitioner CREATE** - Student Exercise 2
- 📝 **Patient family search** - Student Exercise 3

## FHIR Compliance

This API follows FHIR R4 specification (v4.0.1) and implements:
- RESTful interactions (read, search, create)
- FHIR Bundle for search results (searchset type)
- FHIR OperationOutcome for error handling
- CapabilityStatement for server metadata
- Token search (identifier) and String search (family) parameters
- Prefer header support (return=minimal, return=representation)
- Location header on resource creation`,
    contact: {
      name: 'Roberto Araneda Espinoza',
      email: 'robaraneda@gmail.com',
      url: 'https://www.cens.cl'
    },
    license: {
      name: 'MIT License',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/baseR4',
      description: 'Local development server - FHIR R4 base endpoint'
    },
    {
      url: 'http://localhost:3000',
      description: 'Local development server - Root'
    }
  ],
  tags: [
    {
      name: 'FHIR Metadata',
      description: 'FHIR server capability information and CapabilityStatement'
    },
    {
      name: 'Patient',
      description: 'FHIR Patient resource operations (⚠️ Partially Implemented: CREATE only)'
    },
    {
      name: 'Practitioner',
      description: 'FHIR Practitioner resource operations (⚠️ Partially Implemented: READ and SEARCH only)'
    }
  ],
  paths: {
    '/metadata': {
      get: {
        tags: ['FHIR Metadata'],
        summary: 'Get server capabilities',
        description: 'Returns FHIR CapabilityStatement describing server capabilities, supported resources, and operations',
        operationId: 'getMetadata',
        responses: {
          '200': {
            description: 'CapabilityStatement resource',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/CapabilityStatement'
                }
              }
            }
          }
        }
      }
    },
    '/Patient': {
      post: {
        tags: ['Patient'],
        summary: 'Create new Patient',
        description: `✅ **FULLY IMPLEMENTED** - Create a new Patient resource from FHIR Patient JSON.

**Implementation Details:**
- Removes any client-provided ID (per FHIR spec)
- Transforms FHIR Patient to legacy format
- Creates patient in legacy API
- Returns created FHIR Patient with server-assigned ID
- Supports Prefer header: return=minimal or return=representation
- Returns Location header with created resource URL`,
        operationId: 'createPatient',
        parameters: [
          {
            name: 'Prefer',
            in: 'header',
            description: 'Prefer header: return=minimal (201 with Location header only) or return=representation (201 with body)',
            required: false,
            schema: {
              type: 'string',
              enum: ['return=minimal', 'return=representation']
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/fhir+json': {
              schema: {
                $ref: '#/components/schemas/Patient'
              },
              example: {
                resourceType: 'Patient',
                identifier: [
                  {
                    system: 'https://www.registrocivil.cl/rut',
                    value: '12.345.678-9'
                  }
                ],
                name: [
                  {
                    family: 'González Pérez',
                    given: ['Juan']
                  }
                ],
                birthDate: '1985-05-15',
                telecom: [
                  { system: 'phone', value: '+56912345678' },
                  { system: 'email', value: 'juan.gonzalez@email.cl' }
                ]
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Patient created successfully',
            headers: {
              Location: {
                description: 'URL of the created Patient resource',
                schema: {
                  type: 'string',
                  example: '/baseR4/Patient/1'
                }
              }
            },
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/Patient'
                }
              }
            }
          },
          '400': {
            description: 'Invalid FHIR Patient resource',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          },
          '500': {
            description: 'Server error',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Patient'],
        summary: 'Search patients',
        description: `🚧 **STUDENT EXERCISE 1** - Returns 501 Not Implemented

**TODO**: Implement this endpoint to:
1. Retrieve all patients from legacy API
2. Transform to FHIR Patient resources
3. Return FHIR Bundle with searchset type

**Reference**: See Practitioner search implementation`,
        operationId: 'searchPatients',
        parameters: [
          {
            name: '_format',
            in: 'query',
            description: 'Response format',
            required: false,
            schema: {
              type: 'string',
              enum: ['json', 'application/json', 'application/fhir+json']
            }
          }
        ],
        responses: {
          '501': {
            description: 'Not Implemented - Student Exercise',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          }
        }
      }
    },
    '/Patient/{id}': {
      get: {
        tags: ['Patient'],
        summary: 'Read patient by ID',
        description: `🚧 **STUDENT EXERCISE 1** - Returns 501 Not Implemented

**TODO**: Implement this endpoint to:
1. Retrieve patient by ID from legacy API
2. Transform to FHIR Patient resource
3. Return 404 if not found

**Reference**: See Practitioner read by ID implementation`,
        operationId: 'getPatientById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Patient ID',
            schema: {
              type: 'string'
            }
          },
          {
            name: '_format',
            in: 'query',
            description: 'Response format',
            required: false,
            schema: {
              type: 'string',
              enum: ['json', 'application/json', 'application/fhir+json']
            }
          }
        ],
        responses: {
          '501': {
            description: 'Not Implemented - Student Exercise',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          }
        }
      }
    },
    '/Practitioner': {
      get: {
        tags: ['Practitioner'],
        summary: 'Search practitioners',
        description: `✅ **FULLY IMPLEMENTED** - Search for Practitioners with optional identifier filter

**Implementation Details:**
- Returns all practitioners if no filter provided
- Supports TOKEN search with identifier parameter
- Token search format: ?identifier=[value] or ?identifier=[system]|[value]
- RNPI system: https://www.superintendenciadesalud.gob.cl/rnpi
- Returns FHIR Bundle with searchset type

**Examples:**
- GET /baseR4/Practitioner
- GET /baseR4/Practitioner?identifier=12345
- GET /baseR4/Practitioner?identifier=https://www.superintendenciadesalud.gob.cl/rnpi|12345`,
        operationId: 'searchPractitioners',
        parameters: [
          {
            name: 'identifier',
            in: 'query',
            description: 'Search by RNPI identifier (TOKEN search: [system]|[value] or [value])',
            required: false,
            schema: {
              type: 'string'
            },
            example: 'https://www.superintendenciadesalud.gob.cl/rnpi|12345'
          },
          {
            name: '_format',
            in: 'query',
            description: 'Response format',
            required: false,
            schema: {
              type: 'string',
              enum: ['json', 'application/json', 'application/fhir+json']
            }
          }
        ],
        responses: {
          '200': {
            description: 'Bundle of Practitioner resources',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/Bundle'
                }
              }
            }
          },
          '400': {
            description: 'Invalid search parameters',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          },
          '406': {
            description: 'Not Acceptable - Invalid format parameter',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          },
          '500': {
            description: 'Server error',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Practitioner'],
        summary: 'Create new Practitioner',
        description: `🚧 **STUDENT EXERCISE 2** - Returns 501 Not Implemented

**TODO**: Implement this endpoint to:
1. Parse FHIR Practitioner from request body
2. Remove any client-provided ID
3. Transform to legacy format
4. Create in legacy API
5. Return created FHIR Practitioner with Location header

**Reference**: See Patient create implementation`,
        operationId: 'createPractitioner',
        parameters: [
          {
            name: 'Prefer',
            in: 'header',
            description: 'Prefer header: return=minimal or return=representation',
            required: false,
            schema: {
              type: 'string',
              enum: ['return=minimal', 'return=representation']
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/fhir+json': {
              schema: {
                $ref: '#/components/schemas/Practitioner'
              }
            }
          }
        },
        responses: {
          '501': {
            description: 'Not Implemented - Student Exercise',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          }
        }
      }
    },
    '/Practitioner/{id}': {
      get: {
        tags: ['Practitioner'],
        summary: 'Read practitioner by ID',
        description: `✅ **FULLY IMPLEMENTED** - Read a single Practitioner resource by ID

**Implementation Details:**
- Retrieves practitioner from legacy API by ID
- Transforms to FHIR Practitioner resource
- Returns 404 if not found
- Supports _format parameter`,
        operationId: 'getPractitionerById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Practitioner ID',
            schema: {
              type: 'string'
            }
          },
          {
            name: '_format',
            in: 'query',
            description: 'Response format',
            required: false,
            schema: {
              type: 'string',
              enum: ['json', 'application/json', 'application/fhir+json']
            }
          }
        ],
        responses: {
          '200': {
            description: 'Practitioner resource',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/Practitioner'
                }
              }
            }
          },
          '404': {
            description: 'Practitioner not found',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          },
          '406': {
            description: 'Not Acceptable - Invalid format parameter',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          },
          '500': {
            description: 'Server error',
            content: {
              'application/fhir+json': {
                schema: {
                  $ref: '#/components/schemas/OperationOutcome'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Patient: {
        type: 'object',
        description: 'FHIR Patient resource (R4)',
        properties: {
          resourceType: {
            type: 'string',
            enum: ['Patient']
          },
          id: {
            type: 'string',
            description: 'Logical ID (server-assigned)'
          },
          identifier: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                system: {
                  type: 'string',
                  description: 'Identifier system (e.g., https://www.registrocivil.cl/rut)'
                },
                value: {
                  type: 'string',
                  description: 'Identifier value (e.g., RUT)'
                }
              }
            }
          },
          name: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                family: {
                  type: 'string',
                  description: 'Family name (Chilean: apellido_paterno + apellido_materno)'
                },
                given: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Given names'
                }
              }
            }
          },
          birthDate: {
            type: 'string',
            format: 'date',
            description: 'Date of birth (YYYY-MM-DD)'
          },
          telecom: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                system: {
                  type: 'string',
                  enum: ['phone', 'email']
                },
                value: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      Practitioner: {
        type: 'object',
        description: 'FHIR Practitioner resource (R4)',
        properties: {
          resourceType: {
            type: 'string',
            enum: ['Practitioner']
          },
          id: {
            type: 'string',
            description: 'Logical ID (server-assigned)'
          },
          identifier: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                system: {
                  type: 'string',
                  description: 'Identifier system (e.g., https://www.superintendenciadesalud.gob.cl/rnpi)'
                },
                value: {
                  type: 'string',
                  description: 'Identifier value (e.g., RNPI)'
                }
              }
            }
          },
          name: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                family: {
                  type: 'string',
                  description: 'Family name (Chilean: apellido_paterno + apellido_materno)'
                },
                given: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Given names'
                }
              }
            }
          },
          telecom: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                system: {
                  type: 'string',
                  enum: ['phone', 'email']
                },
                value: {
                  type: 'string'
                }
              }
            }
          },
          qualification: {
            type: 'array',
            description: 'Practitioner qualifications (specializations)',
            items: {
              type: 'object',
              properties: {
                code: {
                  type: 'object',
                  properties: {
                    text: {
                      type: 'string',
                      description: 'Specialization name'
                    }
                  }
                }
              }
            }
          }
        }
      },
      Bundle: {
        type: 'object',
        description: 'FHIR Bundle resource (searchset)',
        properties: {
          resourceType: {
            type: 'string',
            enum: ['Bundle']
          },
          type: {
            type: 'string',
            enum: ['searchset']
          },
          total: {
            type: 'integer',
            description: 'Total number of matching resources'
          },
          entry: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fullUrl: {
                  type: 'string',
                  description: 'Absolute URL of the resource'
                },
                resource: {
                  oneOf: [
                    { $ref: '#/components/schemas/Patient' },
                    { $ref: '#/components/schemas/Practitioner' }
                  ]
                },
                search: {
                  type: 'object',
                  properties: {
                    mode: {
                      type: 'string',
                      enum: ['match']
                    }
                  }
                }
              }
            }
          }
        }
      },
      OperationOutcome: {
        type: 'object',
        description: 'FHIR OperationOutcome resource (error/information)',
        properties: {
          resourceType: {
            type: 'string',
            enum: ['OperationOutcome']
          },
          issue: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                severity: {
                  type: 'string',
                  enum: ['fatal', 'error', 'warning', 'information']
                },
                code: {
                  type: 'string',
                  enum: ['invalid', 'structure', 'required', 'not-found', 'not-supported']
                },
                diagnostics: {
                  type: 'string',
                  description: 'Additional diagnostic information'
                }
              }
            }
          }
        }
      },
      CapabilityStatement: {
        type: 'object',
        description: 'FHIR CapabilityStatement resource',
        properties: {
          resourceType: {
            type: 'string',
            enum: ['CapabilityStatement']
          },
          status: {
            type: 'string',
            enum: ['active']
          },
          date: {
            type: 'string',
            format: 'date-time'
          },
          kind: {
            type: 'string',
            enum: ['instance']
          },
          fhirVersion: {
            type: 'string',
            example: '4.0.1'
          },
          format: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          rest: {
            type: 'array',
            items: {
              type: 'object'
            }
          }
        }
      }
    }
  }
};
