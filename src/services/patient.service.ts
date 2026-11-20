/**
 * Patient Service - Business logic for Patient resource operations
 * Following the same pattern as facade-java PatientService.java
 */

import { Patient, Bundle } from '../types/fhir.types';
import { patientMapper } from '../mappers/patient.mapper';
import { legacyApiClient } from './legacy-api.client';

export class PatientService {
  /**
   * Create a new patient - FULLY IMPLEMENTED
   * 
   * Flow: FHIR Patient -> toLegacy() -> Legacy API -> toFhir() -> FHIR Patient
   */
  async createPatient(fhirPatient: Patient): Promise<Patient> {
    // 1. Transform FHIR Patient to legacy format
    const legacyData = patientMapper.toLegacy(fhirPatient);

    // 2. Create in legacy API
    const createdLegacyPatient = await legacyApiClient.createPatient(legacyData);

    // 3. Transform back to FHIR
    const createdFhirPatient = patientMapper.toFhir(createdLegacyPatient);

    return createdFhirPatient;
  }

  /**
   * Search for patients - STUDENT EXERCISE 1
   * 
   * TODO: Students must implement this method
   * 
   * Steps:
   * 1. Get all patients from legacy API using legacyApiClient.getPatients()
   * 2. If family parameter is provided, filter patients by family name
   * 3. Transform list to FHIR Bundle using patientMapper.toBundle()
   * 4. Return the Bundle
   */
  async searchPatients(_family?: string): Promise<Bundle> {
    let doctors = await legacyApiClient.getPatients();

    return patientMapper.toBundle(doctors);
  }

  /**
   * Get a patient by ID - STUDENT EXERCISE 1
   * 
   * TODO: Students must implement this method
   * 
   * Steps:
   * 1. Call legacyApiClient.getPatient(id)
   * 2. If patient not found, return null
   * 3. Transform legacy patient to FHIR using patientMapper.toFhir()
   * 4. Return the FHIR Patient
   */
  async getPatientById(id: string): Promise<Patient | null> {
    const patient = await legacyApiClient.getPatient(id);

    if (!patient) {
      return null;
    }

    return patientMapper.toFhir(patient);
  }

  /**
   * Check if patient's family name matches search term - STUDENT EXERCISE 3
   * 
   * Requirements:
   * - Case-insensitive search
   * - Partial match (contains)
   * - Search in full family name (apellido_paterno + apellido_materno)
   */
  private matchesFamily(familyName: string, searchTerm: string): boolean {
    // TODO: Implement this helper method (EXERCISE 3)
    return true; // Placeholder
  }
}

// Export singleton instance
export const patientService = new PatientService();
