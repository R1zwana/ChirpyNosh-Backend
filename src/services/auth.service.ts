import prisma from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterDto, LoginDto } from '../validators/auth';
import { LoginResponse, SafeUser, JwtPayload } from '../types';
import { ConflictError, UnauthorizedError } from '../middleware/errorHandler';
import { User } from '@prisma/client';

/**
 * Convert User to SafeUser (remove password hash)
 */
function toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
}

/**
 * Register a new user
 */
export async function register(data: RegisterDto): Promise<LoginResponse> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    // Hash password and create user
    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            name: data.name,
            role: data.role,
        },
    });

    // Generate token
    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const token = generateToken(payload);

    return {
        user: toSafeUser(user),
        token,
    };
}

/**
 * Login an existing user
 */
export async function login(data: LoginDto): Promise<LoginResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.passwordHash);

    if (!isValidPassword) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // Generate token
    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const token = generateToken(payload);

    return {
        user: toSafeUser(user),
        token,
    };
}

/**
 * Get current user by ID
 */
export async function getCurrentUser(userId: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return null;
    }

    return toSafeUser(user);
}
