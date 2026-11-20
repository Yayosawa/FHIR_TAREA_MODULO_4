import { Router } from 'express';
import patientRoutes from './patient.routes';
import practitionerRoutes from './practitioner.routes';

const router = Router();

// FHIR-compliant resource routes (capitalized as per FHIR spec)
router.use('/Patient', patientRoutes);
router.use('/Practitioner', practitionerRoutes);

/**
 * FHIR metadata endpoint - Returns detailed CapabilityStatement.
 * This is a standard FHIR endpoint for server capabilities discovery.
 * GET /baseR4/metadata
 */
router.get('/metadata', (_req, res) => {
  res.setHeader('Content-Type', 'application/fhir+json;charset=UTF-8');
  res.json({
    resourceType: 'CapabilityStatement',
    status: 'active',
    date: new Date().toISOString(),
    publisher: 'CENS - Curso FHIR Intermedio 2026',
    kind: 'instance',
    fhirVersion: '4.0.1',
    format: ['application/fhir+json', 'json'],
    contact: [
      {
        name: 'Roberto Araneda Espinoza',
        telecom: [
          {
            system: 'email',
            value: 'robaraneda@gmail.com',
          },
        ],
      },
    ],
    software: {
      name: 'FHIR Facade API - TypeScript (Express)',
      version: '1.0.0',
    },
    implementation: {
      description: 'FHIR R4 Facade for Chilean Medical Appointments Legacy System',
      url: 'http://localhost:3000/baseR4',
    },
    rest: [
      {
        mode: 'server',
        documentation: 'Main FHIR endpoint for Chilean Medical Appointments',
        security: {
          cors: true,
          description: 'No authentication required for educational purposes',
        },
        resource: [
          {
            type: 'Patient',
            profile: 'http://hl7.org/fhir/StructureDefinition/Patient',
            versioning: 'no-version',
            documentation:
              '⚠️ PARTIALLY IMPLEMENTED: Only CREATE is available. Students must implement READ and SEARCH-TYPE operations.',
            interaction: [
              {
                code: 'create',
                documentation: 'Create new Patient (✅ IMPLEMENTED)',
              },
            ],
            searchParam: [],
          },
          {
            type: 'Practitioner',
            profile: 'http://hl7.org/fhir/StructureDefinition/Practitioner',
            versioning: 'no-version',
            documentation:
              '⚠️ PARTIALLY IMPLEMENTED: READ and SEARCH-TYPE are available. Students must implement CREATE operation.',
            interaction: [
              {
                code: 'read',
                documentation: 'Read Practitioner by ID (✅ IMPLEMENTED)',
              },
              {
                code: 'search-type',
                documentation: 'Search all Practitioners (✅ IMPLEMENTED)',
              },
            ],
            searchParam: [
              {
                name: '_id',
                type: 'token',
                documentation: 'Search by Practitioner ID',
              },
              {
                name: 'identifier',
                type: 'token',
                documentation:
                  'Search by identifier (e.g., RNPI). Supports token search: [system]|[value] or [value]. Example: ?identifier=https://www.superintendenciadesalud.gob.cl/rnpi|12345',
              },
            ],
          },
        ],
      },
    ],
  });
});

export default router;
