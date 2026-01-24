import { Request, Response, NextFunction } from 'express';
import { expirationService } from '../services';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { CreateExpirationDto, UpdateExpirationDto } from '../validators/expiration';

/**
 * Get all expiration items
 * GET /api/expirations
 */
export async function getAll(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const items = await expirationService.getAllExpirations();
        sendSuccess(res, items);
    } catch (error) {
        next(error);
    }
}

/**
 * Get expiring soon items
 * GET /api/expirations/soon
 */
export async function getExpiringSoon(
    req: Request<unknown, unknown, unknown, { days?: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const days = req.query.days ? parseInt(req.query.days, 10) : 3;
        const items = await expirationService.getExpiringSoon(days);
        sendSuccess(res, items);
    } catch (error) {
        next(error);
    }
}

/**
 * Get expiration item by ID
 * GET /api/expirations/:id
 */
export async function getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const item = await expirationService.getExpirationById(req.params.id);
        sendSuccess(res, item);
    } catch (error) {
        next(error);
    }
}

/**
 * Create a new expiration item
 * POST /api/expirations
 */
export async function create(
    req: Request<unknown, unknown, CreateExpirationDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const item = await expirationService.createExpiration(req.body);
        sendCreated(res, item, 'Expiration item created successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Update an expiration item
 * PUT /api/expirations/:id
 */
export async function update(
    req: Request<{ id: string }, unknown, UpdateExpirationDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const item = await expirationService.updateExpiration(req.params.id, req.body);
        sendSuccess(res, item, 200, 'Expiration item updated successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Delete an expiration item
 * DELETE /api/expirations/:id
 */
export async function remove(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await expirationService.deleteExpiration(req.params.id);
        sendNoContent(res);
    } catch (error) {
        next(error);
    }
}
