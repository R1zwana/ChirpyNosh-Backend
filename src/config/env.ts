import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface EnvConfig {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CORS_ORIGINS: string[];
}

function getEnvString(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
        throw new Error(`Environment variable ${key} is required`);
    }
    return value || defaultValue!;
}

function getEnvNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
        throw new Error(`Environment variable ${key} is required`);
    }
    const parsed = parseInt(value || String(defaultValue), 10);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be a number`);
    }
    return parsed;
}

function getEnvArray(key: string, defaultValue: string[] = []): string[] {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.split(',').map((s) => s.trim()).filter(Boolean);
}

export const env: EnvConfig = {
    NODE_ENV: (getEnvString('NODE_ENV', 'development') as EnvConfig['NODE_ENV']),
    PORT: getEnvNumber('PORT', 3000),
    DATABASE_URL: getEnvString('DATABASE_URL'),
    JWT_SECRET: getEnvString('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvString('JWT_EXPIRES_IN', '7d'),
    CORS_ORIGINS: getEnvArray('CORS_ORIGINS', ['http://localhost:5173']),
};

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
