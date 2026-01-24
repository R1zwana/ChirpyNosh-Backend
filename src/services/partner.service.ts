import prisma from '../lib/prisma';
import { Partner } from '@prisma/client';
import { CreatePartnerDto, UpdatePartnerDto } from '../validators/partner';
import { NotFoundError } from '../middleware/errorHandler';

/**
 * Get all partners
 */
export async function getAllPartners(): Promise<Partner[]> {
    return prisma.partner.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Get partner by ID
 */
export async function getPartnerById(id: string): Promise<Partner> {
    const partner = await prisma.partner.findUnique({
        where: { id },
    });

    if (!partner) {
        throw new NotFoundError('Partner');
    }

    return partner;
}

/**
 * Create a new partner
 */
export async function createPartner(data: CreatePartnerDto, userId: string): Promise<Partner> {
    return prisma.partner.create({
        data: {
            name: data.name,
            type: data.type,
            address: data.address,
            verified: data.verified,
            userId,
        },
    });
}

/**
 * Update a partner
 */
export async function updatePartner(id: string, data: UpdatePartnerDto): Promise<Partner> {
    // Check if partner exists
    const existing = await prisma.partner.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Partner');
    }

    return prisma.partner.update({
        where: { id },
        data,
    });
}

/**
 * Delete a partner
 */
export async function deletePartner(id: string): Promise<void> {
    // Check if partner exists
    const existing = await prisma.partner.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Partner');
    }

    await prisma.partner.delete({
        where: { id },
    });
}

/**
 * Get partner by user ID
 */
export async function getPartnerByUserId(userId: string): Promise<Partner | null> {
    return prisma.partner.findUnique({
        where: { userId },
    });
}
