import { Router } from 'express';
import { practitionerController } from '../controllers';

const router = Router();

// GET /api/practitioners - Search practitioners
router.get('/', (req, res) => practitionerController.searchPractitioners(req, res));

// GET /api/practitioners/:id - Get practitioner by ID
router.get('/:id', (req, res) => practitionerController.getPractitioner(req, res));

// POST /api/practitioners - Create a new practitioner
router.post('/', (req, res) => practitionerController.createPractitioner(req, res));

// PUT /api/practitioners/:id - Update a practitioner
router.put('/:id', (req, res) => practitionerController.updatePractitioner(req, res));

// DELETE /api/practitioners/:id - Delete a practitioner
router.delete('/:id', (req, res) => practitionerController.deletePractitioner(req, res));

export default router;
