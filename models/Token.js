const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

TokenSchema.index({ user: 1 }, { unique: true })

module.exports = mongoose.model('Token', TokenSchema)
