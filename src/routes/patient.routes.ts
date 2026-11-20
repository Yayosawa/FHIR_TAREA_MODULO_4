import { Router } from 'express';
import { patientController } from '../controllers';

const router = Router();

// GET /api/patients - Search patients
router.get('/', (req, res) => patientController.searchPatients(req, res));

// GET /api/patients/:id - Get patient by ID
router.get('/:id', (req, res) => patientController.getPatient(req, res));

// POST /api/patients - Create a new patient
router.post('/', (req, res) => patientController.createPatient(req, res));

// PUT /api/patients/:id - Update a patient
router.put('/:id', (req, res) => patientController.updatePatient(req, res));

// DELETE /api/patients/:id - Delete a patient
router.delete('/:id', (req, res) => patientController.deletePatient(req, res));

export default router;
