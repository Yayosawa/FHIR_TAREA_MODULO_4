/**
 * FHIR R4 Types
 * Re-export commonly used FHIR types for easier imports
 */

// Note: Using simple interfaces instead of @ahryman40k/ts-fhir-types for educational simplicity
// In production, use a proper FHIR TypeScript library

export interface Patient {
  resourceType: 'Patient';
  id?: string;
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
}

export interface Practitioner {
  resourceType: 'Practitioner';
  id?: string;
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  qualification?: PractitionerQualification[];
}

export interface Bundle {
  resourceType: 'Bundle';
  type: 'searchset' | 'transaction' | 'collection' | 'document';
  total?: number;
  entry?: BundleEntry[];
}

export interface BundleEntry {
  fullUrl?: string;
  resource?: Patient | Practitioner | any;
  search?: {
    mode: 'match' | 'include' | 'outcome';
  };
}

export interface OperationOutcome {
  resourceType: 'OperationOutcome';
  issue: OperationOutcomeIssue[];
}

export interface OperationOutcomeIssue {
  severity: 'fatal' | 'error' | 'warning' | 'information';
  code: string;
  diagnostics?: string;
}

export interface Identifier {
  use?: 'official' | 'usual' | 'temp' | 'secondary';
  type?: CodeableConcept;
  system?: string;
  value?: string;
}

export interface HumanName {
  use?: 'official' | 'usual' | 'nickname' | 'maiden';
  text?: string;
  family?: string;
  given?: string[];
}

export interface ContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Coding {
  system?: string;
  code?: string;
  display?: string;
}

export interface PractitionerQualification {
  identifier?: Identifier[];
  code: CodeableConcept;
  period?: Period;
}

export interface Period {
  start?: string;
  end?: string;
}

export interface CapabilityStatement {
  resourceType: 'CapabilityStatement';
  status: 'draft' | 'active' | 'retired';
  date: string;
  publisher?: string;
  kind: 'instance' | 'capability' | 'requirements';
  software?: {
    name: string;
    version: string;
  };
  implementation?: {
    description: string;
    url: string;
  };
  fhirVersion: string;
  format: string[];
  rest?: CapabilityStatementRest[];
}

export interface CapabilityStatementRest {
  mode: 'client' | 'server';
  documentation?: string;
  security?: {
    cors?: boolean;
    description?: string;
  };
  resource?: CapabilityStatementResource[];
}

export interface CapabilityStatementResource {
  type: string;
  profile?: string;
  documentation?: string;
  interaction?: Array<{
    code: string;
    documentation?: string;
  }>;
  searchParam?: Array<{
    name: string;
    type: string;
    documentation?: string;
  }>;
}
