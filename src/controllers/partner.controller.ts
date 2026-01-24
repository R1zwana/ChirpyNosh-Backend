import { Request, Response, NextFunction } from 'express';
import { partnerService } from '../services';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { CreatePartnerDto, UpdatePartnerDto } from '../validators/partner';

/**
 * Get all partners
 * GET /api/partners
 */
export async function getAll(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const partners = await partnerService.getAllPartners();
        sendSuccess(res, partners);
    } catch (error) {
        next(error);
    }
}

/**
 * Get partner by ID
 * GET /api/partners/:id
 */
export async function getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const partner = await partnerService.getPartnerById(req.params.id);
        sendSuccess(res, partner);
    } catch (error) {
        next(error);
    }
}

/**
 * Create a new partner
 * POST /api/partners
 */
export async function create(
    req: Request<unknown, unknown, CreatePartnerDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const partner = await partnerService.createPartner(req.body, userId);
        sendCreated(res, partner, 'Partner created successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Update a partner
 * PUT /api/partners/:id
 */
export async function update(
    req: Request<{ id: string }, unknown, UpdatePartnerDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const partner = await partnerService.updatePartner(req.params.id, req.body);
        sendSuccess(res, partner, 200, 'Partner updated successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Delete a partner
 * DELETE /api/partners/:id
 */
export async function remove(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await partnerService.deletePartner(req.params.id);
        sendNoContent(res);
    } catch (error) {
        next(error);
    }
}
