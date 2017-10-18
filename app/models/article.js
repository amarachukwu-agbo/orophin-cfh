/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
* Article Schema
*/
const ArticleSchema = new Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: true,
  },
  content: {
    type: String,
    default: '',
    trim: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

mongoose.model('Article', ArticleSchema);

