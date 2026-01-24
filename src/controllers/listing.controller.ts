import { Request, Response, NextFunction } from 'express';
import { listingService, partnerService } from '../services';
import { UnauthorizedError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated, sendNoContent, calculatePaginationMeta } from '../utils/apiResponse';
import { CreateListingDto, UpdateListingDto } from '../validators/listing';
import { PaginationParams } from '../types';

/**
 * Get all listings with pagination
 * GET /api/listings
 */
export async function getAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const category = req.query.category as string | undefined;
        const listingType = req.query.listingType as string | undefined;
        const partnerId = req.query.partnerId as string | undefined;

        const pagination: PaginationParams = {
            page,
            limit,
            skip: (page - 1) * limit,
        };

        const query = { page, limit, category, listingType, partnerId } as any;
        const { listings, total } = await listingService.getListings(query, pagination);
        const meta = calculatePaginationMeta(page, limit, total);

        sendSuccess(res, listings, 200, undefined, meta);
    } catch (error) {
        next(error);
    }
}

/**
 * Get listing by ID
 * GET /api/listings/:id
 */
export async function getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const listing = await listingService.getListingById(req.params.id);
        sendSuccess(res, listing);
    } catch (error) {
        next(error);
    }
}

/**
 * Create a new listing
 * POST /api/listings
 */
export async function create(
    req: Request<unknown, unknown, CreateListingDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Authentication required');
        }

        const partner = await partnerService.getPartnerByUserId(req.user.userId);
        if (!partner) {
            throw new UnauthorizedError('User is not a registered partner');
        }

        const listing = await listingService.createListing({
            ...req.body,
            partnerId: partner.id,
        });
        sendCreated(res, listing, 'Listing created successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Update a listing
 * PUT /api/listings/:id
 */
export async function update(
    req: Request<{ id: string }, unknown, UpdateListingDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const listing = await listingService.updateListing(req.params.id, req.body);
        sendSuccess(res, listing, 200, 'Listing updated successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Delete a listing
 * DELETE /api/listings/:id
 */
export async function remove(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await listingService.deleteListing(req.params.id);
        sendNoContent(res);
    } catch (error) {
        next(error);
    }
}
