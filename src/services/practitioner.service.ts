/**
 * Practitioner Service - Business logic for Practitioner resource operations
 * Following the same pattern as facade-java PractitionerService.java
 * FULLY IMPLEMENTED - Students can use this as reference
 */

import { Practitioner, Bundle } from '../types/fhir.types';
import { practitionerMapper } from '../mappers/practitioner.mapper';
import { legacyApiClient } from './legacy-api.client';

export class PractitionerService {
  /**
   * Search for practitioners with optional identifier filter - FULLY IMPLEMENTED
   * 
   * Implements FHIR R4 Token Search on identifier parameter
   * Token search format: [system]|[value] or just [value]
   */
  async searchPractitioners(identifier?: string): Promise<Bundle> {
    // 1. Get all doctors from legacy API
    let doctors = await legacyApiClient.getDoctors();

    // 2. Filter by identifier if provided (Token Search)
    if (identifier) {
      // Parse token search parameter: [system]|[value] or [value]
      let system: string | undefined;
      let value: string | undefined;

      if (identifier.includes('|')) {
        const parts = identifier.split('|');
        system = parts[0].trim() || undefined;
        value = parts.length > 1 ? parts[1].trim() : undefined;
      } else {
        value = identifier.trim();
      }

      // Filter doctors that match the identifier
      doctors = doctors.filter(doctor => this.matchesIdentifier(doctor, system, value));
    }

    // 3. Transform to FHIR Bundle
    return practitionerMapper.toBundle(doctors);
  }

  /**
   * Get a practitioner by ID - FULLY IMPLEMENTED
   */
  async getPractitionerById(id: string): Promise<Practitioner | null> {
    // 1. Get doctor from legacy API
    const legacyDoctor = await legacyApiClient.getDoctor(id);

    // 2. Check if found
    if (!legacyDoctor) {
      return null;
    }

    // 3. Transform to FHIR
    return practitionerMapper.toFhir(legacyDoctor);
  }

  /**
   * Create a new practitioner - STUDENT EXERCISE 3
   * 
   * TODO: Students must implement this method following the Patient.createPatient() pattern
   * 
   * Steps:
   * 1. Transform FHIR Practitioner to legacy format using practitionerMapper.toLegacy()
   * 2. Create in legacy API using legacyApiClient.createDoctor()
   * 3. Transform response back to FHIR using practitionerMapper.toFhir()
   * 4. Return created FHIR Practitioner
   */
  async createPractitioner(fhirPractitioner: Practitioner): Promise<Practitioner> {
    // 1. Transform FHIR Practitioner to legacy format
    const legacyData = practitionerMapper.toLegacy(fhirPractitioner);

    // 2. Create in legacy API
    const createdLegacyPractitioner = await legacyApiClient.createDoctor(legacyData);

    // 3. Transform back to FHIR
    const createdFhirPatient = practitionerMapper.toFhir(createdLegacyPractitioner);

    return createdFhirPatient;
  }

  /**
   * Check if doctor's identifier matches the search criteria - FULLY IMPLEMENTED
   * 
   * Token search matching logic:
   * - If system is specified, must match exactly
   * - Value must match exactly (case-sensitive for tokens)
   * - If only value provided, matches any system with that value
   */
  private matchesIdentifier(
    doctor: any,
    system: string | undefined,
    value: string | undefined
  ): boolean {
    const doctorRnpi = String(doctor.rnpi || '');

    // If no value to search, no match
    if (!value) {
      return false;
    }

    // If system is specified, check it matches
    if (system) {
      const expectedSystem = 'https://www.superintendenciadesalud.gob.cl/rnpi';
      if (system !== expectedSystem) {
        return false;
      }
    }

    // Check if RNPI matches the value (exact match for token search)
    return doctorRnpi === value;
  }
}

// Export singleton instance
export const practitionerService = new PractitionerService();
