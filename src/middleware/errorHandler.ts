import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { sendError, sendBadRequest, sendNotFound, sendConflict } from '../utils/apiResponse';
import { isProduction } from '../config/env';

/**
 * Custom application error class
 */
export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Create specific error types
 */
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Log error in development
    if (!isProduction) {
        console.error('Error:', err);
    }

    // Handle Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': // Unique constraint violation
                sendConflict(res, 'A record with this value already exists');
                return;
            case 'P2025': // Record not found
                sendNotFound(res, 'Record');
                return;
            case 'P2003': // Foreign key constraint violation
                sendBadRequest(res, 'Related record not found');
                return;
            default:
                sendError(res, 'Database error', 500);
                return;
        }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        sendBadRequest(res, 'Invalid data provided');
        return;
    }

    // Handle custom application errors
    if (err instanceof AppError) {
        sendError(res, err.message, err.statusCode);
        return;
    }

    // Handle unexpected errors
    const message = isProduction ? 'Internal server error' : err.message;
    sendError(res, message, 500);
}

/**
 * 404 handler for unknown routes
 */
export function notFoundHandler(_req: Request, res: Response): void {
    sendNotFound(res, 'Route');
}
