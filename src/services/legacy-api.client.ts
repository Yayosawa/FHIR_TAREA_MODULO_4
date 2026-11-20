/**
 * Legacy API Client - HTTP client to consume Chilean legacy API
 * Using Axios for HTTP requests
 */

import axios, { AxiosInstance } from 'axios';
import { LegacyPatient, LegacyDoctor } from '../types/legacy.types';

export class LegacyApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.LEGACY_API_URL || 'http://localhost:8000') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // ===== Patient endpoints =====

  async getPatients(): Promise<LegacyPatient[]> {
    const response = await this.client.get<LegacyPatient[]>('/api/Paciente');
    return response.data;
  }

  async getPatient(id: string): Promise<LegacyPatient | null> {
    const patients = await this.getPatients();
    return patients.find(p => String(p.id) === id) || null;
  }

  async createPatient(data: Partial<LegacyPatient>): Promise<LegacyPatient> {
    const response = await this.client.post<LegacyPatient>('/api/Paciente', data);
    return response.data;
  }

  // ===== Doctor (Practitioner) endpoints =====

  async getDoctors(): Promise<LegacyDoctor[]> {
    const response = await this.client.get<LegacyDoctor[]>('/api/Medico');
    return response.data;
  }

  async getDoctor(id: string): Promise<LegacyDoctor | null> {
    const doctors = await this.getDoctors();
    return doctors.find(d => String(d.id) === id) || null;
  }

  async createDoctor(data: Partial<LegacyDoctor>): Promise<LegacyDoctor> {
    const response = await this.client.post<LegacyDoctor>('/api/Medico', data);
    return response.data;
  }
}

// Export singleton instance
export const legacyApiClient = new LegacyApiClient();
