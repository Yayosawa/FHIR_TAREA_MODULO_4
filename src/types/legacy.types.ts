/**
 * Legacy API Types - Chilean Medical System
 * These types represent the data structures from the legacy REST API
 */

export interface LegacyPatient {
  id: number;
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  nacimiento: string; // ISO date string
  telefono: string;
  email: string;
}

export interface LegacyDoctor {
  id: number;
  rnpi: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  email: string;
  especialidad_id: number;
  especialidades: Array<{
    id: number;
    nombre: string;
  }>;
}
