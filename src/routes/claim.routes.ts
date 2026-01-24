import { Router } from 'express';
import { claimController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validate';
import { authenticate, optionalAuth } from '../middleware/auth';
import { createClaimSchema, updateClaimStatusSchema, claimIdSchema } from '../validators/claim';

const router = Router();

/**
 * GET /api/claims
 * Get all claims for the current user
 */
router.get('/', authenticate, claimController.getAll);

/**
 * GET /api/claims/:id
 * Get claim by ID
 */
router.get('/:id', authenticate, validateParams(claimIdSchema), claimController.getById);

/**
 * POST /api/claims
 * Create a new claim (optional auth - can be public)
 */
router.post('/', optionalAuth, validateBody(createClaimSchema), claimController.create);

/**
 * PATCH /api/claims/:id/status
 * Update claim status
 */
router.patch(
    '/:id/status',
    authenticate,
    validateParams(claimIdSchema),
    validateBody(updateClaimStatusSchema),
    claimController.updateStatus
);

export default router;
