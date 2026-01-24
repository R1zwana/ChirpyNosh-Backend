import { Request, Response, NextFunction } from 'express';
import { claimService } from '../services';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { CreateClaimDto, UpdateClaimStatusDto } from '../validators/claim';

/**
 * Get all claims for the current user
 * GET /api/claims
 */
export async function getAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const claims = await claimService.getClaimsByUserId(userId);
        sendSuccess(res, claims);
    } catch (error) {
        next(error);
    }
}

/**
 * Get claim by ID
 * GET /api/claims/:id
 */
export async function getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const claim = await claimService.getClaimById(req.params.id);
        sendSuccess(res, claim);
    } catch (error) {
        next(error);
    }
}

/**
 * Create a new claim
 * POST /api/claims
 */
export async function create(
    req: Request<unknown, unknown, CreateClaimDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user?.userId;
        const claim = await claimService.createClaim(req.body, userId);
        sendCreated(res, claim, 'Claim created successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Update claim status
 * PATCH /api/claims/:id/status
 */
export async function updateStatus(
    req: Request<{ id: string }, unknown, UpdateClaimStatusDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const claim = await claimService.updateClaimStatus(req.params.id, req.body);
        sendSuccess(res, claim, 200, 'Claim status updated successfully');
    } catch (error) {
        next(error);
    }
}
