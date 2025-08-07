const express = require('express');
const router = express.Router();
const EventGallery = require('../models/Event-gallery'); // Adjust path as needed

// Gallery page route
router.get('/gallery', async (req, res) => {
  try {
    // Fetch all events with photos, sorted by date (newest first)
    const eventsWithPhotos = await EventGallery.find({ 
      photos: { $exists: true, $ne: [] } 
    }).sort({ date: -1 });

    // Group events by club for better organization
    const clubGalleries = {};
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

    res.render('Gallery/gallery', { 
      title: 'ClubEaria - Gallery', 
      clubGalleries: organizedGalleries,
      totalEvents: eventsWithPhotos.length
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.render('gallery', { 
      title: 'ClubEaria - Gallery', 
      clubGalleries: [],
      totalEvents: 0,
      error: 'Unable to load gallery at the moment'
    });
  }
});

module.exports = router;
