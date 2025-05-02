const express = require('express');
const router = express.Router();
const Progress = require("../models/videoprogress");

// Merge overlapping intervals
function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a.start - b.start);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];
    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }
  return merged;
}

// Save progress
router.post('/', async (req, res) => {
  const { userId, videoId, newInterval, duration } = req.body;
  try {
    let progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      progress = new Progress({ userId, videoId, watchedIntervals: [newInterval], duration });
    } else {
      progress.watchedIntervals.push(newInterval);
      progress.watchedIntervals = mergeIntervals(progress.watchedIntervals);
    }

    await progress.save();
    const totalWatched = progress.watchedIntervals.reduce((acc, curr) => acc + (curr.end - curr.start), 0);
    const percentage = duration ? Math.min((totalWatched / duration) * 100, 100) : 0;

    res.json({ progress: percentage.toFixed(2), intervals: progress.watchedIntervals });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get progress
router.get('/:userId/:videoId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.params.userId, videoId: req.params.videoId });
    if (!progress) return res.status(404).json({ message: 'No progress found' });

    const totalWatched = progress.watchedIntervals.reduce((acc, curr) => acc + (curr.end - curr.start), 0);
    const percentage = progress.duration ? Math.min((totalWatched / progress.duration) * 100, 100) : 0;

    res.json({ progress: percentage.toFixed(2), intervals: progress.watchedIntervals });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
