const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reclamationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    description: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    confidence: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
    },
    references: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("reclamation", reclamationSchema);
