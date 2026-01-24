import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../utils/jwt';
import { sendUnauthorized, sendForbidden } from '../utils/apiResponse';
import { UserRole } from '@prisma/client';

/**
 * Middleware to authenticate JWT token
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        sendUnauthorized(res, 'No token provided');
        return;
    }

    const payload = verifyToken(token);

    if (!payload) {
        sendUnauthorized(res, 'Invalid or expired token');
        return;
    }

    req.user = payload;
    next();
}

/**
 * Middleware to optionally authenticate (user may or may not be logged in)
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
        const payload = verifyToken(token);
        if (payload) {
            req.user = payload;
        }
    }

    next();
}

/**
 * Middleware to require specific roles
 */
export function requireRole(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            sendUnauthorized(res, 'Authentication required');
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            sendForbidden(res, 'Insufficient permissions');
            return;
        }

        next();
    };
}

/**
 * Middleware to require admin role
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Middleware to require partner role
 */
export const requirePartner = requireRole(UserRole.ADMIN, UserRole.PARTNER);

/**
 * Middleware to require recipient role
 */
export const requireRecipient = requireRole(UserRole.ADMIN, UserRole.RECIPIENT);
