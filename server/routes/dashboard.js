import express from 'express';
import { prisma } from '../server.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard stats
router.get('/admin', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count()
    ]);

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
