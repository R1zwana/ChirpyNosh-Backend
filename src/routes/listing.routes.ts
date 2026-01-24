import { Router } from 'express';
import { listingController } from '../controllers';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createListingSchema, updateListingSchema, listingIdSchema, listingQuerySchema } from '../validators/listing';

const router = Router();

/**
 * GET /api/listings
 * Get all listings with pagination and filtering
 */
router.get('/', validateQuery(listingQuerySchema), listingController.getAll);

/**
 * GET /api/listings/:id
 * Get listing by ID
 */
router.get('/:id', validateParams(listingIdSchema), listingController.getById);

/**
 * POST /api/listings
 * Create a new listing (requires auth)
 */
router.post('/', authenticate, validateBody(createListingSchema), listingController.create);

/**
 * PUT /api/listings/:id
 * Update a listing (requires auth)
 */
router.put(
    '/:id',
    authenticate,
    validateParams(listingIdSchema),
    validateBody(updateListingSchema),
    listingController.update
);

/**
 * DELETE /api/listings/:id
 * Delete a listing (requires auth)
 */
router.delete('/:id', authenticate, validateParams(listingIdSchema), listingController.remove);

export default router;
