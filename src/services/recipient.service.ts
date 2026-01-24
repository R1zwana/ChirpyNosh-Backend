import prisma from '../lib/prisma';
import { Recipient } from '@prisma/client';
import { CreateRecipientDto, UpdateRecipientDto } from '../validators/recipient';
import { NotFoundError } from '../middleware/errorHandler';

/**
 * Get all recipients
 */
export async function getAllRecipients(): Promise<Recipient[]> {
    return prisma.recipient.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Get recipient by ID
 */
export async function getRecipientById(id: string): Promise<Recipient> {
    const recipient = await prisma.recipient.findUnique({
        where: { id },
    });

    if (!recipient) {
        throw new NotFoundError('Recipient');
    }

    return recipient;
}

/**
 * Create a new recipient
 */
export async function createRecipient(data: CreateRecipientDto, userId: string): Promise<Recipient> {
    return prisma.recipient.create({
        data: {
            orgName: data.orgName,
            address: data.address,
            capacity: data.capacity,
            verified: data.verified,
            userId,
        },
    });
}

/**
 * Update a recipient
 */
export async function updateRecipient(id: string, data: UpdateRecipientDto): Promise<Recipient> {
    // Check if recipient exists
    const existing = await prisma.recipient.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Recipient');
    }

    return prisma.recipient.update({
        where: { id },
        data,
    });
}

/**
 * Delete a recipient
 */
export async function deleteRecipient(id: string): Promise<void> {
    // Check if recipient exists
    const existing = await prisma.recipient.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Recipient');
    }

    await prisma.recipient.delete({
        where: { id },
    });
}

/**
 * Get recipient by user ID
 */
export async function getRecipientByUserId(userId: string): Promise<Recipient | null> {
    return prisma.recipient.findUnique({
        where: { userId },
    });
}
