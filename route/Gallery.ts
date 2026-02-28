import express from 'express';
const router = express.Router();
import EventGallery from '../models/Event-gallery'; // Adjust path as needed

// Gallery page route
router.get('/gallery', async (req: express.Request, res: express.Response) => {
  try {
    // Fetch all events with photos, sorted by date (newest first)
    const eventsWithPhotos = await EventGallery.find({
      photos: { $exists: true, $ne: [] }
    }).sort({ date: -1 });

    // Group events by club for better organization
    const clubGalleries: Record<string, any> = {};
    eventsWithPhotos.forEach(event => {
      if (!clubGalleries[event.clubName]) {
        clubGalleries[event.clubName] = {
          clubId: event.clubId,
          clubName: event.clubName,
          events: []
        };
      }
      clubGalleries[event.clubName].events.push(event);
    });

    // Convert to array for easier template iteration
    const organizedGalleries = Object.values(clubGalleries);

    res.json({
      title: 'ClubEaria - Gallery',
      clubGalleries: organizedGalleries,
      totalEvents: eventsWithPhotos.length
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({
      error: 'Unable to load gallery',
      details: (error as any).message
    });
  }
});

export default router;
