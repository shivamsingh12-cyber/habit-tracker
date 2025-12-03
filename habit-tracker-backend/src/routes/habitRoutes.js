const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createHabit,
  getHabits,
  getHabitById,
  checkin,
  getLeaderboard
} = require('../controllers/habitController');

router.use(auth);

router.post('/', createHabit);
router.get('/', getHabits);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getHabitById);
router.post('/:id/checkin', checkin);

module.exports = router;
