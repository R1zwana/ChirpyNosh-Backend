import { z } from 'zod';
import { UserRole } from '@prisma/client';

/**
 * Register request validation schema
 */
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    role: z.nativeEnum(UserRole).optional().default(UserRole.PUBLIC),
});

export type RegisterDto = z.infer<typeof registerSchema>;

/**
 * Login request validation schema
 */
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;
