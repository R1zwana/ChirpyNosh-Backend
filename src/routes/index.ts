import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import partnerRoutes from './partner.routes';
import recipientRoutes from './recipient.routes';
import listingRoutes from './listing.routes';
import claimRoutes from './claim.routes';
import expirationRoutes from './expiration.routes';
import notificationRoutes from './notification.routes';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'ChirpyNosh API is running',
        timestamp: new Date().toISOString(),
    });
});

/**
 * Mount all routes
 */
router.use('/auth', authRoutes);
router.use('/partners', partnerRoutes);
router.use('/recipients', recipientRoutes);
router.use('/listings', listingRoutes);
router.use('/claims', claimRoutes);
router.use('/expirations', expirationRoutes);
router.use('/notifications', notificationRoutes);

export default router;
