import { User } from '@prisma/client';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

// JWT Payload type
export interface JwtPayload {
    userId: string;
    email: string;
    role: User['role'];
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

// Safe user type (without password)
export type SafeUser = Omit<User, 'passwordHash'>;

// Auth types
export interface LoginResponse {
    user: SafeUser;
    token: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    name: string;
    role?: User['role'];
}

export interface LoginInput {
    email: string;
    password: string;
}
