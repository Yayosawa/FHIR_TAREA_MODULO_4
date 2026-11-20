/**
 * Patient Mapper - Bidirectional transformation between Legacy and FHIR Patient
 * Following the same pattern as facade-java PatientMapper.java
 */

import { Patient, Bundle, BundleEntry, HumanName, Identifier, ContactPoint, CodeableConcept, Coding } from '../types/fhir.types';
import { LegacyPatient } from '../types/legacy.types';

export class PatientMapper {
  /**
   * Transform legacy patient to FHIR Patient resource
   */
  toFhir(legacyPatient: LegacyPatient): Patient {
    const patient: Patient = {
      resourceType: 'Patient',
      active: true
    };

    // ID
    if (legacyPatient.id) {
      patient.id = String(legacyPatient.id);
    }

    // Identifier - RUT (Chilean national identifier)
    if (legacyPatient.rut) {
      const rutIdentifier: Identifier = {
        use: 'official',
        system: 'https://www.registrocivil.cl/rut',
        value: legacyPatient.rut,
        type: {
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'NNCHL',
            display: 'National Person Identifier - Chile'
          }],
          text: 'RUT'
        }
      };
      patient.identifier = [rutIdentifier];
    }

    // Name - Chilean format with two surnames
    const name: HumanName = {
      use: 'official'
    };

    if (legacyPatient.nombre) {
      name.given = [legacyPatient.nombre];
    }

    // Family name - combine both surnames
    const familyParts: string[] = [];
    if (legacyPatient.apellido_paterno) familyParts.push(legacyPatient.apellido_paterno);
    if (legacyPatient.apellido_materno) familyParts.push(legacyPatient.apellido_materno);
    
    if (familyParts.length > 0) {
      name.family = familyParts.join(' ');
    }

    // Full text representation
    const textParts: string[] = [];
    if (legacyPatient.nombre) textParts.push(legacyPatient.nombre);
    if (name.family) textParts.push(name.family);
    name.text = textParts.join(' ');

    patient.name = [name];

    // Telecom - Phone and Email
    const telecom: ContactPoint[] = [];

    if (legacyPatient.telefono) {
      telecom.push({
        system: 'phone',
        value: legacyPatient.telefono,
        use: 'mobile'
      });
    }

    if (legacyPatient.email) {
      telecom.push({
        system: 'email',
        value: legacyPatient.email,
        use: 'home'
      });
    }

    if (telecom.length > 0) {
      patient.telecom = telecom;
    }

    // Birth Date
    if (legacyPatient.nacimiento) {
      patient.birthDate = legacyPatient.nacimiento;
    }

    return patient;
  }

  /**
   * Transform FHIR Patient to legacy format
   * Used for CREATE and UPDATE operations
   */
  toLegacy(fhirPatient: Patient): any {
    const legacyData: any = {};

    // Extract RUT from identifier (required)
    if (fhirPatient.identifier && Array.isArray(fhirPatient.identifier)) {
      const rutIdentifier = fhirPatient.identifier.find(
        id => id.system === 'https://www.registrocivil.cl/rut'
      );
      if (rutIdentifier?.value) {
        legacyData.rut = rutIdentifier.value;
      }
    }

    // Extract name components (required)
    if (fhirPatient.name && Array.isArray(fhirPatient.name) && fhirPatient.name.length > 0) {
      const name = fhirPatient.name[0];

      // Given name (first name) - required
      if (name.given && Array.isArray(name.given) && name.given.length > 0) {
        legacyData.nombre = name.given[0];
      }

      // Family name (surnames) - split into two parts
      if (name.family) {
        const parts = name.family.split(' ');
        legacyData.apellido_paterno = parts[0] || '';
        // apellido_materno is optional - only add if it exists
        if (parts.length > 1 && parts[1]) {
          legacyData.apellido_materno = parts[1];
        }
      }
    }

    // Extract contact info (optional fields)
    if (fhirPatient.telecom && Array.isArray(fhirPatient.telecom)) {
      for (const contact of fhirPatient.telecom) {
        if (contact.system === 'phone' && contact.value) {
          legacyData.telefono = contact.value;
        } else if (contact.system === 'email' && contact.value) {
          legacyData.email = contact.value;
        }
      }
    }

    // Birth date (optional)
    if (fhirPatient.birthDate) {
      legacyData.nacimiento = fhirPatient.birthDate;
    }

    return legacyData;
  }

  /**
   * Create a FHIR Bundle (searchset) from a list of legacy patients
   * 
   * TODO: Students must implement this method following the PractitionerMapper.toBundle() pattern
   * This is needed for STUDENT EXERCISE 1 - GET /Patient
   */
  toBundle(legacyPatients: LegacyPatient[]): Bundle {
    const bundle: Bundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: legacyPatients.length,
      entry: []
    };

    for (const legacyPatient of legacyPatients) {
      const patient = this.toFhir(legacyPatient);
      
      const entry: BundleEntry = {
        fullUrl: `Patient/${patient.id}`,
        resource: patient,
        search: {
          mode: 'match'
        }
      };

      bundle.entry!.push(entry);
    }

    return bundle;
  }
}

// Export singleton instance
export const patientMapper = new PatientMapper();
