import { Router } from 'express';
import { recipientController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createRecipientSchema, updateRecipientSchema, recipientIdSchema } from '../validators/recipient';

const router = Router();

/**
 * GET /api/recipients
 * Get all recipients
 */
router.get('/', recipientController.getAll);

/**
 * GET /api/recipients/:id
 * Get recipient by ID
 */
router.get('/:id', validateParams(recipientIdSchema), recipientController.getById);

/**
 * POST /api/recipients
 * Create a new recipient (requires auth)
 */
router.post('/', authenticate, validateBody(createRecipientSchema), recipientController.create);

/**
 * PUT /api/recipients/:id
 * Update a recipient (requires auth)
 */
router.put(
    '/:id',
    authenticate,
    validateParams(recipientIdSchema),
    validateBody(updateRecipientSchema),
    recipientController.update
);

/**
 * DELETE /api/recipients/:id
 * Delete a recipient (requires auth)
 */
router.delete('/:id', authenticate, validateParams(recipientIdSchema), recipientController.remove);

export default router;
