import { Router } from 'express';
import { partnerController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createPartnerSchema, updatePartnerSchema, partnerIdSchema } from '../validators/partner';

const router = Router();

/**
 * GET /api/partners
 * Get all partners
 */
router.get('/', partnerController.getAll);

/**
 * GET /api/partners/:id
 * Get partner by ID
 */
router.get('/:id', validateParams(partnerIdSchema), partnerController.getById);

/**
 * POST /api/partners
 * Create a new partner (requires auth)
 */
router.post('/', authenticate, validateBody(createPartnerSchema), partnerController.create);

/**
 * PUT /api/partners/:id
 * Update a partner (requires auth)
 */
router.put(
    '/:id',
    authenticate,
    validateParams(partnerIdSchema),
    validateBody(updatePartnerSchema),
    partnerController.update
);

/**
 * DELETE /api/partners/:id
 * Delete a partner (requires auth)
 */
router.delete('/:id', authenticate, validateParams(partnerIdSchema), partnerController.remove);

export default router;
