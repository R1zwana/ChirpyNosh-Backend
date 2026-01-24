import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

/**
 * Send a successful API response
 */
export function sendSuccess<T>(
    res: Response,
    data: T,
    statusCode = 200,
    message?: string,
    meta?: PaginationMeta
): Response {
    const response: ApiResponse<T> = {
        success: true,
        data,
        message,
        meta,
    };
    return res.status(statusCode).json(response);
}

/**
 * Send a created response (201)
 */
export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return sendSuccess(res, data, 201, message);
}

/**
 * Send a no content response (204)
 */
export function sendNoContent(res: Response): Response {
    return res.status(204).send();
}

/**
 * Send an error response
 */
export function sendError(
    res: Response,
    error: string,
    statusCode = 500,
    message?: string
): Response {
    const response: ApiResponse = {
        success: false,
        error,
        message,
    };
    return res.status(statusCode).json(response);
}

/**
 * Send a bad request error (400)
 */
export function sendBadRequest(res: Response, error: string): Response {
    return sendError(res, error, 400, 'Bad Request');
}

/**
 * Send an unauthorized error (401)
 */
export function sendUnauthorized(res: Response, error = 'Unauthorized'): Response {
    return sendError(res, error, 401, 'Unauthorized');
}

/**
 * Send a forbidden error (403)
 */
export function sendForbidden(res: Response, error = 'Forbidden'): Response {
    return sendError(res, error, 403, 'Forbidden');
}

/**
 * Send a not found error (404)
 */
export function sendNotFound(res: Response, resource = 'Resource'): Response {
    return sendError(res, `${resource} not found`, 404, 'Not Found');
}

/**
 * Send a conflict error (409)
 */
export function sendConflict(res: Response, error: string): Response {
    return sendError(res, error, 409, 'Conflict');
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
    page: number,
    limit: number,
    total: number
): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}
