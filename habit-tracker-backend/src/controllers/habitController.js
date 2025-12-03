const Habit = require('../models/Habit');
const Checkin = require('../models/Checkin');
const mongoose = require('mongoose');

const todayString = () => new Date().toISOString().slice(0, 10);

// compute current streak for this user+habit
const computeStreak = async (userId, habitId) => {
  const checkins = await Checkin.find({ user: userId, habit: habitId })
    .sort({ date: -1 })
    .lean();

  if (!checkins.length) return 0;

  let streak = 0;
  let current = todayString();

  for (const c of checkins) {
    if (c.date === current) {
      streak++;
      const d = new Date(current);
      d.setDate(d.getDate() - 1);
      current = d.toISOString().slice(0, 10);
    } else if (c.date < current) {
      break;
    }
  }
  return streak;
};

exports.createHabit = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const habit = await Habit.create({
    name,
    description,
    createdBy: req.user.id,
    members: [req.user.id]
  });

  res.json(habit);
};

exports.getHabits = async (req, res) => {
  const userId = req.user.id;
  const habits = await Habit.find({ members: userId }).lean();

  const result = [];
  for (const habit of habits) {
    const streak = await computeStreak(userId, habit._id);
    const todayCheckin = await Checkin.findOne({
      habit: habit._id,
      user: userId,
      date: todayString()
    });

    result.push({
      ...habit,
      streak,
      checkedInToday: !!todayCheckin
    });
  }

  res.json(result);
};

exports.getHabitById = async (req, res) => {
  const habitId = req.params.id;
  const habit = await Habit.findById(habitId).lean();
  if (!habit) return res.status(404).json({ error: 'Habit not found' });

  res.json(habit);
};

exports.checkin = async (req, res) => {
  const Habit = require('../models/Habit');
  const Activity = require('../models/Activity'); // ⭐ add this
  const habitId = req.params.id;
  const userId = req.user.id;
  const date = todayString();

  const existing = await Checkin.findOne({ habit: habitId, user: userId, date });
  if (existing) {
    return res.status(400).json({ error: 'Already checked in today' });
  }

  // ⭐ Create the check-in entry
  const checkin = await Checkin.create({ habit: habitId, user: userId, date });

  // ⭐ Recompute streak
  const streak = await computeStreak(userId, habitId);

  // ⭐ Log an activity entry (this is what populates your Real-time Activity box)
  await Activity.create({
    habit: habitId,
    user: userId,
    message: `checked in today`
  });

  // Keep your existing socket event (even if you don't use it for activity feed)
  const io = req.app.get('io');
  io.to(`habit:${habitId}`).emit('checkin_created', {
    habitId,
    userId,
    date,
    streak
  });

  res.json({ checkin, streak });
};


exports.getLeaderboard = async (req, res) => {
  // simple leaderboard: total checkins per user
  const agg = await Checkin.aggregate([
    {
      $group: {
        _id: '$user',
        totalCheckins: { $sum: 1 }
      }
    },
    { $sort: { totalCheckins: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        email: '$user.email',
        totalCheckins: 1
      }
    }
  ]);

  res.json(agg);
};
