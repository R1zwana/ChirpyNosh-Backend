import { Request, Response, NextFunction } from 'express';
import { recipientService } from '../services';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { CreateRecipientDto, UpdateRecipientDto } from '../validators/recipient';

/**
 * Get all recipients
 * GET /api/recipients
 */
export async function getAll(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const recipients = await recipientService.getAllRecipients();
        sendSuccess(res, recipients);
    } catch (error) {
        next(error);
    }
}

/**
 * Get recipient by ID
 * GET /api/recipients/:id
 */
export async function getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const recipient = await recipientService.getRecipientById(req.params.id);
        sendSuccess(res, recipient);
    } catch (error) {
        next(error);
    }
}

/**
 * Create a new recipient
 * POST /api/recipients
 */
export async function create(
    req: Request<unknown, unknown, CreateRecipientDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const recipient = await recipientService.createRecipient(req.body, userId);
        sendCreated(res, recipient, 'Recipient created successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Update a recipient
 * PUT /api/recipients/:id
 */
export async function update(
    req: Request<{ id: string }, unknown, UpdateRecipientDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const recipient = await recipientService.updateRecipient(req.params.id, req.body);
        sendSuccess(res, recipient, 200, 'Recipient updated successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Delete a recipient
 * DELETE /api/recipients/:id
 */
export async function remove(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await recipientService.deleteRecipient(req.params.id);
        sendNoContent(res);
    } catch (error) {
        next(error);
    }
}
