const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema(
  {
    habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
