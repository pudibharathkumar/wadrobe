import { Router } from 'express';
import type { Response } from 'express';
import prisma from '../prisma/client.js';
import axios from 'axios';
import { upload } from '../config/cloudinary.js';
import { authenticate } from '../middleware/authenticate.js';
import type { AuthRequest } from '../middleware/authenticate.js';

const router = Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Get all clothing items for a user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id; 
  try {
    const items = await prisma.clothingItem.findMany({
      where: { userId },
      include: { tags: true }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Upload image and get auto-tags
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const imageUrl = (req.file as any).path;

  try {
    // Call AI service for auto-tagging
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/auto-tag?image_url=${encodeURIComponent(imageUrl)}`);
    
    res.json({
      imageUrl,
      autoTags: aiResponse.data
    });
  } catch (error) {
    console.error('AI Service Error:', error);
    // Return image URL even if AI fails, so user can manually tag
    res.json({
      imageUrl,
      autoTags: null,
      warning: 'AI auto-tagging failed'
    });
  }
});

// Manual auto-tag an existing item
router.post('/auto-tag', async (req: Request, res: Response) => {
  const { imageUrl } = req.body;
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/auto-tag?image_url=${encodeURIComponent(imageUrl)}`);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(500).json({ error: 'AI auto-tagging failed' });
  }
});

// Add new clothing item
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { imageUrl, category, color, brand, season, occasion, tags } = req.body;
  const userId = req.user!.id;

  try {
    const newItem = await prisma.clothingItem.create({
      data: {
        userId,
        imageUrl,
        category,
        color,
        brand,
        season,
        occasion,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      }
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

export default router;
