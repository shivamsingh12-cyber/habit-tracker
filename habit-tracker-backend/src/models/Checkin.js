const mongoose = require('mongoose');
const { Schema } = mongoose;

const checkinSchema = new Schema(
  {
    habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true } // format: YYYY-MM-DD
  },
  { timestamps: true }
);

checkinSchema.index({ habit: 1, user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Checkin', checkinSchema);
