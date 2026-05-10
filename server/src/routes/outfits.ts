import { Router } from 'express';
import type { Response } from 'express';
import prisma from '../prisma/client.js';
import axios from 'axios';
import { cache } from '../utils/cache.js';
import { authenticate } from '../middleware/authenticate.js';
import type { AuthRequest } from '../middleware/authenticate.js';

const router = Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Get all outfits for a user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id; 
  try {
    const outfits = await prisma.outfit.findMany({
      where: { userId },
      include: { 
        items: {
          include: { clothingItem: true }
        }
      }
    });
    res.json(outfits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch outfits' });
  }
});

// Generate a new outfit using AI
router.post('/generate', authenticate, async (req: AuthRequest, res: Response) => {
  const { occasion, weather, preferences } = req.body;
  const userId = req.user!.id;

  const cacheKey = `outfit_${userId}_${occasion}_${weather}`;
  const cachedOutfit = cache.get(cacheKey);
  if (cachedOutfit) {
    return res.json(cachedOutfit);
  }

  try {
    // Fetch all user items to provide as context to AI
    const items = await prisma.clothingItem.findMany({
      where: { userId }
    });

    if (items.length === 0) {
      return res.status(400).json({ error: 'No clothing items found in wardrobe' });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/generate-outfit`, {
      items,
      occasion,
      weather,
      user_preferences: preferences
    });

    cache.set(cacheKey, response.data, 1800); // Cache for 30 mins

    res.json(response.data);
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    res.status(500).json({ error: 'Failed to generate outfit suggestion' });
  }
});

// Create a new outfit (save to DB)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { name, items, season, occasion } = req.body;
  const userId = req.user!.id;

  try {
    const outfit = await prisma.outfit.create({
      data: {
        userId,
        name,
        season,
        occasion,
        items: {
          create: items.map((itemId: string) => ({
            clothingItemId: itemId
          }))
        }
      }
    });
    res.status(201).json(outfit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create outfit' });
  }
});

export default router;
