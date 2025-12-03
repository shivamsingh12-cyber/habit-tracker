const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const auth = require("../middleware/authMiddleware");

router.get("/:habitId", auth, async (req, res) => {
  const habitId = req.params.habitId;

  const activities = await Activity.find({ habit: habitId })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  res.json(activities);
});

module.exports = router;
