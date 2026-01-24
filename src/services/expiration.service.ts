import prisma from '../lib/prisma';
import { ExpirationItem } from '@prisma/client';
import { CreateExpirationDto, UpdateExpirationDto } from '../validators/expiration';
import { NotFoundError } from '../middleware/errorHandler';

/**
 * Get all expiration items
 */
export async function getAllExpirations(): Promise<ExpirationItem[]> {
    return prisma.expirationItem.findMany({
        orderBy: { expiresOn: 'asc' },
    });
}

/**
 * Get expiration item by ID
 */
export async function getExpirationById(id: string): Promise<ExpirationItem> {
    const item = await prisma.expirationItem.findUnique({
        where: { id },
    });

    if (!item) {
        throw new NotFoundError('Expiration item');
    }

    return item;
}

/**
 * Create a new expiration item
 */
export async function createExpiration(data: CreateExpirationDto): Promise<ExpirationItem> {
    return prisma.expirationItem.create({
        data: {
            item: data.item,
            expiresOn: new Date(data.expiresOn),
            notes: data.notes,
        },
    });
}

/**
 * Update an expiration item
 */
export async function updateExpiration(id: string, data: UpdateExpirationDto): Promise<ExpirationItem> {
    // Check if item exists
    const existing = await prisma.expirationItem.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Expiration item');
    }

    return prisma.expirationItem.update({
        where: { id },
        data: {
            item: data.item,
            expiresOn: data.expiresOn ? new Date(data.expiresOn) : undefined,
            notes: data.notes,
        },
    });
}

/**
 * Delete an expiration item
 */
export async function deleteExpiration(id: string): Promise<void> {
    // Check if item exists
    const existing = await prisma.expirationItem.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Expiration item');
    }

    await prisma.expirationItem.delete({
        where: { id },
    });
}

/**
 * Get expiration items expiring soon (within days)
 */
export async function getExpiringSoon(days: number = 3): Promise<ExpirationItem[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.expirationItem.findMany({
        where: {
            expiresOn: {
                lte: futureDate,
                gte: new Date(),
            },
        },
        orderBy: { expiresOn: 'asc' },
    });
}
