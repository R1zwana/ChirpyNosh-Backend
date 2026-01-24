import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/apiResponse';
import { RegisterDto, LoginDto } from '../validators/auth';

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(
    req: Request<unknown, unknown, RegisterDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await authService.register(req.body);
        sendCreated(res, result, 'User registered successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Login a user
 * POST /api/auth/login
 */
export async function login(
    req: Request<unknown, unknown, LoginDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await authService.login(req.body);
        sendSuccess(res, result, 200, 'Login successful');
    } catch (error) {
        next(error);
    }
}

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export async function getMe(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            sendNotFound(res, 'User');
            return;
        }

        const user = await authService.getCurrentUser(req.user.userId);

        if (!user) {
            sendNotFound(res, 'User');
            return;
        }

        sendSuccess(res, user);
    } catch (error) {
        next(error);
    }
}
