import { Router } from 'express';
import { expirationController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createExpirationSchema, updateExpirationSchema, expirationIdSchema } from '../validators/expiration';

const router = Router();

/**
 * GET /api/expirations
 * Get all expiration items
 */
router.get('/', authenticate, expirationController.getAll);

/**
 * GET /api/expirations/soon
 * Get items expiring soon
 */
router.get('/soon', authenticate, expirationController.getExpiringSoon);

/**
 * GET /api/expirations/:id
 * Get expiration item by ID
 */
router.get('/:id', authenticate, validateParams(expirationIdSchema), expirationController.getById);

/**
 * POST /api/expirations
 * Create a new expiration item
 */
router.post('/', authenticate, validateBody(createExpirationSchema), expirationController.create);

/**
 * PUT /api/expirations/:id
 * Update an expiration item
 */
router.put(
    '/:id',
    authenticate,
    validateParams(expirationIdSchema),
    validateBody(updateExpirationSchema),
    expirationController.update
);

/**
 * DELETE /api/expirations/:id
 * Delete an expiration item
 */
router.delete('/:id', authenticate, validateParams(expirationIdSchema), expirationController.remove);

export default router;
