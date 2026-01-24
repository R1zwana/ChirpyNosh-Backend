import { z } from 'zod';

/**
 * Common pagination query schema
 */
export const paginationSchema = z.object({
    page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default('1'),
    limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('10'),
});

export type PaginationDto = z.infer<typeof paginationSchema>;

/**
 * Common ID param schema
 */
export const idParamSchema = z.object({
    id: z.string().min(1, 'ID is required'),
});
