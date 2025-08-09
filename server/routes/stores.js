import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const storeValidation = [
  body('name').isLength({ min: 1, max: 100 }).withMessage('Store name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('address').isLength({ max: 400 }).withMessage('Address must not exceed 400 characters')
];

// Get all stores
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const userId = req.user.id;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        createdAt: true,
        ratings: {
          select: {
            rating: true,
            userId: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    });

    // Calculate average rating and user's rating for each store
    const storesWithRatings = stores.map(store => {
      const ratings = store.ratings;
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
      
      const userRating = ratings.find(r => r.userId === userId);
      
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        createdAt: store.createdAt,
        averageRating: Math.round(averageRating * 10) / 10,
        userRating: userRating ? userRating.rating : null,
        totalRatings: ratings.length
      };
    });

    res.json(storesWithRatings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create store (Admin only)
router.post('/', authenticateToken, requireRole(['ADMIN']), storeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, ownerId } = req.body;

    // Check if store email exists
    const existingStore = await prisma.store.findUnique({
      where: { email }
    });

    if (existingStore) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }

    // If ownerId provided, verify the user exists and is a store owner
    if (ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: ownerId }
      });

      if (!owner || owner.role !== 'STORE_OWNER') {
        return res.status(400).json({ message: 'Invalid store owner' });
      }

      // Check if owner already has a store
      const existingOwnerStore = await prisma.store.findUnique({
        where: { ownerId }
      });

      if (existingOwnerStore) {
        return res.status(400).json({ message: 'Store owner already has a store' });
      }
    }

    // Create store
    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: ownerId || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
