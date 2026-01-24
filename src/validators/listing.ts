import { z } from 'zod';
import { ListingCategory, ListingType } from '@prisma/client';

/**
 * Create listing validation schema
 */
export const createListingSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
    category: z.nativeEnum(ListingCategory),
    listingType: z.nativeEnum(ListingType),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    priceEur: z.number().positive('Price must be positive').optional(),
    pickupWindows: z.array(z.string()).min(1, 'At least one pickup window is required'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    partnerId: z.string().min(1, 'Partner ID is required'),
});

export type CreateListingDto = z.infer<typeof createListingSchema>;

/**
 * Update listing validation schema
 */
export const updateListingSchema = z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
    category: z.nativeEnum(ListingCategory).optional(),
    listingType: z.nativeEnum(ListingType).optional(),
    quantity: z.number().int().positive().optional(),
    priceEur: z.number().positive().optional().nullable(),
    pickupWindows: z.array(z.string()).min(1).optional(),
    imageUrl: z.string().url().optional().nullable(),
});

export type UpdateListingDto = z.infer<typeof updateListingSchema>;

/**
 * Listing ID param validation
 */
export const listingIdSchema = z.object({
    id: z.string().min(1, 'Listing ID is required'),
});

/**
 * Listing query validation for pagination and filtering
 */
export const listingQuerySchema = z.object({
    page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default('1'),
    limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('10'),
    category: z.nativeEnum(ListingCategory).optional(),
    listingType: z.nativeEnum(ListingType).optional(),
    partnerId: z.string().optional(),
});

export type ListingQueryDto = z.infer<typeof listingQuerySchema>;
