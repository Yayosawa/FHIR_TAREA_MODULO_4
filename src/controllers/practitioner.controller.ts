import { Request, Response } from 'express';

/**
 * Practitioner Controller
 *
 * Handles FHIR Practitioner resource operations.
 * This controller is PARTIALLY IMPLEMENTED.
 * Students need to implement: POST /Practitioner (create).
 * GET operations are fully implemented as reference.
 *
 * IMPLEMENTATION STATUS:
 * ✅ GET /Practitioner - FULLY IMPLEMENTED (reference for students)
 * ✅ GET /Practitioner/:id - FULLY IMPLEMENTED (reference for students)
 * 🚧 POST /Practitioner - EXERCISE 2 (students must implement)
 */
export class PractitionerController {
  /**
   * Search for practitioners with optional search parameters
   * GET /Practitioner
   *
   * This endpoint is FULLY IMPLEMENTED as a reference following FHIR R4 specification.
   *
   * Supports FHIR R4 token search parameter:
   * - identifier: Search by identifier (e.g., RNPI)
   *   Syntax: ?identifier=[system]|[value] or ?identifier=[value]
   *   Example: ?identifier=https://www.superintendenciadesalud.gob.cl/rnpi|12345
   *   Example: ?identifier=12345
   *
   * Token search semantics per FHIR R4 specification:
   * - Exact match on code/value
   * - System|value format for system-qualified searches
   * - Value-only searches match any system
   *
   * @param req Express request with optional identifier and _format query parameters
   * @param res Express response
   */
  async searchPractitioners(req: Request, res: Response): Promise<void> {
    try {
      // Validate format parameter (only JSON supported for now)
      const format = req.query._format as string | undefined;
      if (format && !this.isJsonFormat(format)) {
        res.status(406)
          .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
          .json(this.createOperationOutcome(
            'error',
            'not-supported',
            `Only JSON format is supported. Requested format: ${format}`
          ));
        return;
      }

      // Import practitioner service dynamically
      const { practitionerService } = await import('../services/practitioner.service');

      // Search practitioners with optional identifier filter
      const identifier = req.query.identifier as string | undefined;
      const bundle = await practitionerService.searchPractitioners(identifier);

      res.status(200)
        .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
        .json(bundle);
    } catch (error: any) {
      res.status(500)
        .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
        .json(this.createOperationOutcome('error', 'exception', `Internal server error: ${error.message}`));
    }
  }

  /**
   * Read a specific practitioner by ID
   * GET /Practitioner/:id
   *
   * This endpoint is FULLY IMPLEMENTED as a reference following FHIR R4 specification.
   *
   * @param req Express request with id path parameter and optional _format query parameter
   * @param res Express response
   */
  async getPractitioner(req: Request, res: Response): Promise<void> {
    try {
      // Validate format parameter (only JSON supported for now)
      const format = req.query._format as string | undefined;
      if (format && !this.isJsonFormat(format)) {
        res.status(406)
          .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
          .json(this.createOperationOutcome(
            'error',
            'not-supported',
            `Only JSON format is supported. Requested format: ${format}`
          ));
        return;
      }

      // Import practitioner service dynamically
      const { practitionerService } = await import('../services/practitioner.service');

      // Get practitioner by ID
      const id = req.params.id;
      const practitioner = await practitionerService.getPractitionerById(id);

      if (!practitioner) {
        res.status(404)
          .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
          .json(this.createOperationOutcome('error', 'not-found', `Practitioner with ID ${id} not found`));
        return;
      }

      res.status(200)
        .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
        .json(practitioner);
    } catch (error: any) {
      res.status(500)
        .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
        .json(this.createOperationOutcome('error', 'exception', `Internal server error: ${error.message}`));
    }
  }

  /**
   * Create a new practitioner
   * POST /Practitioner
   *
   * 🚧 EXERCISE 2 - Students must implement this endpoint
   *
   * FHIR R4 Requirements:
   * 1. Parse FHIR Practitioner from req.body
   * 2. Remove ID if provided (per FHIR spec: "the server SHALL ignore it")
   * 3. Create practitioner: practitionerService.createPractitioner(practitioner) [implement this in PractitionerService]
   * 4. Build Location header: "/baseR4/Practitioner/" + created.id
   * 5. Check Prefer header:
   *    - "return=minimal" → Return 201 with Location header, no body
   *    - Otherwise → Return 201 with Location header + full resource in body (default: return=representation)
   * 6. Catch parsing errors for 400 Bad Request
   * 7. Catch general exceptions for 500 Internal Server Error
   * 8. Use createOperationOutcome for error responses
   *
   * Reference: PatientController.createPatient() - EXACT same pattern
   * Important: Follow FHIR R4 specification for Location header and Prefer header support
   *
   * @param req Express request with Practitioner resource in body
   * @param res Express response
   */
  async createPractitioner(_req: Request, res: Response): Promise<void> {
    res.status(501)
      .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
      .json(this.createOperationOutcome(
        'error',
        'not-supported',
        'Not Implemented - Student Exercise 3: Implement POST /Practitioner'
      ));
  }

  /**
   * Update a practitioner
   * PUT /Practitioner/:id
   *
   * ❌ NOT PART OF EDUCATIONAL EXERCISES - Removed from scope
   * This operation is not required for the FHIR Facade course exercises.
   * Only CREATE, READ, and SEARCH operations are in scope.
   */
  async updatePractitioner(_req: Request, res: Response): Promise<void> {
    res.status(501)
      .setHeader('Content-Type', 'application/fhir+json;charset=UTF-8')
      .json(this.createOperationOutcome(
        'error',
        'not-supported',
        'UPDATE operation is not supported in this educational facade. Only CREATE, READ, and SEARCH are implemented.'
      ));
  }

  /**
   * Delete a practitioner
   * DELETE /Practitioner/:id
   *
   * ❌ NOT PART OF EDUCATIONAL EXERCISES - Removed from scope
   * This operation is not required for the FHIR Facade course exercises.
   * Only CREATE, READ, and SEARCH operations are in scope.
   */
  async deletePractitioner(_req: Request, res: Response): Promise<void> {
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
   * Helper method to create FHIR OperationOutcome for errors
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
export const practitionerController = new PractitionerController();

/**
 * TODO: EXERCISE 2 - Students must implement POST /Practitioner (CREATE)
 *
 * Steps:
 * 1. Parse FHIR Practitioner from req.body
 * 2. Remove ID if provided: delete practitioner.id
 * 3. Import and call practitionerService.createPractitioner(practitioner)
 *    [You need to implement this method in PractitionerService]
 * 4. Build Location header: const locationUrl = `/baseR4/Practitioner/${created.id}`
 * 5. Check Prefer header:
 *    const preferHeader = req.get('Prefer');
 *    const returnMinimal = preferHeader === 'return=minimal';
 *    - If returnMinimal: return 201 with Location header, no body
 *    - Otherwise: return 201 with Location header + full resource (default)
 * 6. Error handling:
 *    - Catch parsing errors → 400 Bad Request with OperationOutcome
 *    - Catch general errors → 500 Internal Server Error with OperationOutcome
 *
 * Reference: PatientController.createPatient() - Follow EXACT same pattern
 */
