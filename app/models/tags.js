const mongoose = require("mongoose");
const { Schema } = mongoose;

const tagsSchema = new Schema({
  name: String,
  types: {
    type: [String],
    enum: ["startup", "corporation"]
  }
});

mongoose.model("tags", tagsSchema);
