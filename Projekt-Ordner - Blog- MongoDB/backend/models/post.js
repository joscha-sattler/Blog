const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: {type: String},

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true} // Info über den User, der den Post anlegt
});


module.exports = mongoose.model('Post', postSchema);

