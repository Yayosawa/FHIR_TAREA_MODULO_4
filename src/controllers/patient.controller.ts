import { Request, Response } from 'express';

/**
 * Patient Controller
 *
 * Handles FHIR Patient resource operations.
 * This controller is PARTIALLY IMPLEMENTED.
 * Students need to implement: GET /Patient (search) and GET /Patient/:id (read).
 *
 * IMPLEMENTATION STATUS:
 * ✅ POST /Patient - FULLY IMPLEMENTED (reference for students)
 * 🚧 GET /Patient - EXERCISE 1 (students must implement)
 * 🚧 GET /Patient/:id - EXERCISE 1 (students must implement)
 */
export class PatientController {
  /**
   * Create a new patient
   * POST /Patient
   *
   * This endpoint is FULLY IMPLEMENTED as a reference following FHIR R4 specification.
   * Accepts a FHIR Patient resource and creates it in the legacy system.
   *
   * Per FHIR spec:
   * - Server SHALL ignore any provided ID in the request body
   * - Server SHALL return Location header with the created resource URL
   * - Server SHALL support Prefer header (return=minimal or return=representation)
   *
   * @param req Express request with Patient resource in body
   * @param res Express response
   */
  async createPatient(req: Request, res: Response): Promise<void> {
    try {
      const fhirPatient = req.body;

      // FHIR spec: "the server SHALL ignore it" - Remove ID if provided
      delete fhirPatient.id;

      // Import patient service dynamically to avoid circular dependencies
      const { patientService } = await import('../services/patient.service');

      // Create patient in legacy system
      const created = await patientService.createPatient(fhirPatient);

      // Build Location header: [base]/[type]/[id]
      // Note: We don't include /_history/[vid] because the legacy API doesn't support versioning
      const locationUrl = `/baseR4/Patient/${created.id}`;

      // Check Prefer header for return preference
      const preferHeader = req.get('Prefer');
      const returnMinimal = preferHeader === 'return=minimal';

      if (returnMinimal) {
        // Return 201 with Location header but no body
        res.status(201)
          .setHeader('Location', locationUrl)
          .setHeader('Content-Type', 'application/fhir+json')
          .send();
      } else {
        // Return 201 with Location header and full resource (default: return=representation)
        res.status(201)
          .setHeader('Location', locationUrl)
          .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
          .json(created);
      }
    } catch (error: any) {
      // Check if it's a parsing error (400 Bad Request)
      if (error.message?.includes('parse') || error.message?.includes('invalid')) {
        res.status(400)
          .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
          .json(this.createOperationOutcome('error', 'invalid', `Resource could not be parsed: ${error.message}`));
      } else {
        // 500 Internal Server Error
        res.status(500)
          .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
          .json(this.createOperationOutcome('error', 'exception', `Internal server error: ${error.message}`));
      }
    }
  }

  /**
   * Search patients with optional search parameters
   * GET /Patient
   *
   * 🚧 EXERCISE 1 - Students must implement this endpoint
   *
   * Students should:
   * 1. Validate _format parameter (use isJsonFormat method below)
   * 2. Call patientService.searchPatients() [you need to implement this method in PatientService]
   * 3. Return 200 OK with Bundle (type: searchset)
   * 4. Handle exceptions with createOperationOutcome
   *
   * Reference: practitionerController.searchPractitioners() (fully implemented)
   *
   * Expected behavior:
   * - GET /Patient → Returns Bundle with all patients
   * - GET /Patient?_format=json → Returns Bundle in JSON format
   * - GET /Patient?_format=xml → Returns 406 Not Acceptable (only JSON supported)
   *
   * @param req Express request with optional _format query parameter
   * @param res Express response
   */
  async searchPatients(req: Request, res: Response): Promise<void> {
    res.status(501)
      .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
      .json(this.createOperationOutcome(
        'error',
        'not-supported',
        'Not Implemented - Student Exercise 1: Implement GET /Patient'
      ));
  }

  /**
   * Read a specific patient by ID
   * GET /Patient/:id
   *
   * 🚧 EXERCISE 1 - Students must implement this endpoint
   *
   * Students should:
   * 1. Extract id from req.params.id
   * 2. Validate _format parameter (use isJsonFormat method below)
   * 3. Call patientService.getPatientById(id) [you need to implement this method in PatientService]
   * 4. Return 200 OK with Patient resource if found
   * 5. Return 404 Not Found with OperationOutcome if not found
   * 6. Handle exceptions with createOperationOutcome
   *
   * Reference: practitionerController.getPractitioner(id) (fully implemented)
   *
   * @param req Express request with id path parameter and optional _format query parameter
   * @param res Express response
   */
  async getPatient(req: Request, res: Response): Promise<void> {
    res.status(501)
      .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
      .json(this.createOperationOutcome(
        'error',
        'not-supported',
        'Not Implemented - Student Exercise 2: Implement GET /Patient/{id}'
      ));
  }

  /**
   * Update a patient
   * PUT /Patient/:id
   *
   * ❌ NOT PART OF EDUCATIONAL EXERCISES - Removed from scope
   * This operation is not required for the FHIR Facade course exercises.
   * Only CREATE, READ, and SEARCH operations are in scope.
   */
  async updatePatient(_req: Request, res: Response): Promise<void> {
    res.status(501)
      .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
      .json(this.createOperationOutcome(
        'error',
        'not-supported',
        'UPDATE operation is not supported in this educational facade. Only CREATE, READ, and SEARCH are implemented.'
      ));
  }

  /**
   * Delete a patient
   * DELETE /Patient/:id
   *
   * ❌ NOT PART OF EDUCATIONAL EXERCISES - Removed from scope
   * This operation is not required for the FHIR Facade course exercises.
   * Only CREATE, READ, and SEARCH operations are in scope.
   */
  async deletePatient(_req: Request, res: Response): Promise<void> {
    res.status(501)
      .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
      .json(this.createOperationOutcome(
        'error',
        'not-supported',
        'DELETE operation is not supported in this educational facade. Only CREATE, READ, and SEARCH are implemented.'
      ));
  }

  /**
   * Check if the requested format is JSON
   * Per FHIR spec, supports: json, application/json, application/fhir+json
   *
   * @param format Format parameter from query string
   * @returns true if format is JSON or undefined (default), false otherwise
   */
  private isJsonFormat(format?: string): boolean {
    if (!format) {
      return true; // Default is JSON
    }
    const lowerFormat = format.toLowerCase();
    return (
      lowerFormat === 'json' ||
      lowerFormat === 'application/json' ||
      lowerFormat === 'application/fhir+json'
    );
  }

  /**
   * Create FHIR OperationOutcome for errors
   *
   * @param severity Issue severity (error, warning, information)
   * @param code Issue type code (e.g., invalid, not-found, exception)
   * @param diagnostics Human-readable description of the issue
   * @returns OperationOutcome resource
   */
  private createOperationOutcome(severity: string, code: string, diagnostics: string) {
    return {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity,
          code,
          diagnostics,
        },
      ],
    };
  }
}

// Export singleton instance
export const patientController = new PatientController();

/**
 * TODO: EXERCISE 1 - Students must implement the following methods
 *
 * 1. searchPatients(req, res)
 *    - Validate _format parameter (use isJsonFormat method)
 *    - Call patientService.searchPatients() [implement this in PatientService]
 *    - Return 200 with Bundle
 *    - Handle exceptions
 *    - Reference: PractitionerController.searchPractitioners()
 *
 * 2. getPatient(req, res)
 *    - Extract id from req.params.id
 *    - Validate _format parameter (use isJsonFormat method)
 *    - Call patientService.getPatientById(id) [implement this in PatientService]
 *    - Return 200 with Patient if found
 *    - Return 404 with OperationOutcome if not found
 *    - Handle exceptions
 *    - Reference: PractitionerController.getPractitioner()
 *
 * TODO: EXERCISE 3 - Students must add family search parameter
 *
 * 3. Modify searchPatients(req, res) to accept family parameter
 *    - Extract family from req.query.family
 *    - Pass to patientService.searchPatients(family)
 *    - Implement string search in service (partial match, case-insensitive)
 *    - Reference: PractitionerController.searchPractitioners(identifier)
 *    - Note: Family is STRING search (partial match), different from identifier TOKEN search (exact match)
 *    - Example: ?family=garcía should find patients with family name containing "García"
 */
