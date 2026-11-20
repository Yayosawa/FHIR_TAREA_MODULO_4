/**
 * Practitioner Mapper - Bidirectional transformation between Legacy and FHIR Practitioner
 * Following the same pattern as facade-java PractitionerMapper.java
 * FULLY IMPLEMENTED - Students can use this as reference
 */

import { Practitioner, Bundle, BundleEntry, HumanName, Identifier, ContactPoint, PractitionerQualification, CodeableConcept, Coding } from '../types/fhir.types';
import { LegacyDoctor } from '../types/legacy.types';

export class PractitionerMapper {
  /**
   * Transform legacy doctor to FHIR Practitioner resource - FULLY IMPLEMENTED
   */
  toFhir(legacyDoctor: LegacyDoctor): Practitioner {
    const practitioner: Practitioner = {
      resourceType: 'Practitioner',
      active: true
    };

    // ID
    if (legacyDoctor.id) {
      practitioner.id = String(legacyDoctor.id);
    }

    // Identifier - RNPI (Chilean practitioner registry number)
    if (legacyDoctor.rnpi) {
      const rnpiIdentifier: Identifier = {
        use: 'official',
        system: 'https://www.superintendenciadesalud.gob.cl/rnpi',
        value: legacyDoctor.rnpi,
        type: {
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'MD',
            display: 'Medical License number'
          }],
          text: 'RNPI'
        }
      };
      practitioner.identifier = [rnpiIdentifier];
    }

    // Name - Chilean format with two surnames
    const name: HumanName = {
      use: 'official'
    };

    if (legacyDoctor.nombre) {
      name.given = [legacyDoctor.nombre];
    }

    // Family name - combine both surnames
    const familyParts: string[] = [];
    if (legacyDoctor.apellido_paterno) familyParts.push(legacyDoctor.apellido_paterno);
    if (legacyDoctor.apellido_materno) familyParts.push(legacyDoctor.apellido_materno);
    
    if (familyParts.length > 0) {
      name.family = familyParts.join(' ');
    }

    // Full text representation
    const textParts: string[] = [];
    if (legacyDoctor.nombre) textParts.push(legacyDoctor.nombre);
    if (name.family) textParts.push(name.family);
    name.text = textParts.join(' ');

    practitioner.name = [name];

    // Telecom - Phone and Email
    const telecom: ContactPoint[] = [];

    if (legacyDoctor.telefono) {
      telecom.push({
        system: 'phone',
        value: legacyDoctor.telefono,
        use: 'work'
      });
    }

    if (legacyDoctor.email) {
      telecom.push({
        system: 'email',
        value: legacyDoctor.email,
        use: 'work'
      });
    }

    if (telecom.length > 0) {
      practitioner.telecom = telecom;
    }

    // Qualification - Medical specialties
    if (legacyDoctor.especialidades && legacyDoctor.especialidades.length > 0) {
      const qualifications: PractitionerQualification[] = [];

      for (const especialidad of legacyDoctor.especialidades) {
        const qualification: PractitionerQualification = {
          code: {
            coding: [{
              system: 'http://example.org/especialidades',
              code: String(especialidad.id),
              display: especialidad.nombre
            }],
            text: especialidad.nombre
          }
        };
        qualifications.push(qualification);
      }

      practitioner.qualification = qualifications;
    }

    return practitioner;
  }

  /**
   * Transform FHIR Practitioner to legacy format - FULLY IMPLEMENTED
   * Used for CREATE and UPDATE operations
   */
  toLegacy(fhirPractitioner: Practitioner): Partial<LegacyDoctor> {
    const legacyData: Partial<LegacyDoctor> = {};

    // Extract RNPI from identifier
    if (fhirPractitioner.identifier) {
      const rnpiIdentifier = fhirPractitioner.identifier.find(
        id => id.system === 'https://www.superintendenciadesalud.gob.cl/rnpi'
      );
      if (rnpiIdentifier?.value) {
        legacyData.rnpi = rnpiIdentifier.value;
      }
    }

    // Extract name components
    if (fhirPractitioner.name && fhirPractitioner.name.length > 0) {
      const name = fhirPractitioner.name[0];

      // Given name (first name)
      if (name.given && name.given.length > 0) {
        legacyData.nombre = name.given[0];
      }

      // Family name (surnames) - split into two parts
      if (name.family) {
        const parts = name.family.split(' ');
        legacyData.apellido_paterno = parts[0] || '';
        legacyData.apellido_materno = parts[1] || '';
      }
    }

    // Extract contact info
    if (fhirPractitioner.telecom) {
      for (const contact of fhirPractitioner.telecom) {
        if (contact.system === 'phone' && contact.value) {
          legacyData.telefono = contact.value;
        } else if (contact.system === 'email' && contact.value) {
          legacyData.email = contact.value;
        }
      }
    }

    // Extract specialty from qualification
    if (fhirPractitioner.qualification && fhirPractitioner.qualification.length > 0) {
      const qualification = fhirPractitioner.qualification[0];
      if (qualification.code?.coding && qualification.code.coding.length > 0) {
        const coding = qualification.code.coding[0];
        if (coding.code) {
          legacyData.especialidad_id = parseInt(coding.code, 10);
        }
      }
    }

    return legacyData;
  }

  /**
   * Create a FHIR Bundle (searchset) from a list of legacy doctors - FULLY IMPLEMENTED
   * This is the reference implementation that students should follow for Patient.toBundle()
   */
  toBundle(legacyDoctors: LegacyDoctor[]): Bundle {
    const bundle: Bundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: legacyDoctors.length,
      entry: []
    };

    for (const legacyDoctor of legacyDoctors) {
      const practitioner = this.toFhir(legacyDoctor);
      
      const entry: BundleEntry = {
        fullUrl: `Practitioner/${practitioner.id}`,
        resource: practitioner,
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
export const practitionerMapper = new PractitionerMapper();
