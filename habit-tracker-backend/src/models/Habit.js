const mongoose = require('mongoose');
const { Schema } = mongoose;

const habitSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);

