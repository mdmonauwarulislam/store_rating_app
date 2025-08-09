import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const ratingValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('storeId').notEmpty().withMessage('Store ID is required')
];

// Submit or update rating
router.post('/', authenticateToken, requireRole(['USER']), ratingValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, storeId } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId
        }
      }
    });

    let result;
    if (existingRating) {
      // Update existing rating
      result = await prisma.rating.update({
        where: {
          userId_storeId: {
            userId,
            storeId
          }
        },
        data: { rating }
      });
    } else {
      // Create new rating
      result = await prisma.rating.create({
        data: {
          rating,
          userId,
          storeId
        }
      });
    }

    res.json({
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings for store owner's store
router.get('/my-store', authenticateToken, requireRole(['STORE_OWNER']), async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the store owned by this user
    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    // Calculate average rating
    const averageRating = store.ratings.length > 0 
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length 
      : 0;

    res.json({
      store: {
        id: store.id,
        name: store.name,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: store.ratings.length
      },
      ratings: store.ratings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
