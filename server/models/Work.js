import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  source: {
    type: String
  },
  date: {
    type: String
  },
  role: {
    type: String
  },
  tools: {
    type: String
  },
  background: {
    type: String
  },
  targetUser: {
    type: String
  },
  idea: {
    type: String
  },
  process: {
    type: String
  },
  highlights: {
    type: String
  },
  materials: {
    type: String
  },
  dataFeedback: {
    type: String
  },
  coverName: {
    type: String
  },
  tags: [{
    type: String
  }],
  jobs: [{
    type: String
  }],
  matchReasons: {
    type: String
  },
  projectDescription: {
    type: String
  },
  interviewScript: {
    type: String
  },
  optimized: {
    type: Boolean,
    default: false
  },
  addedToPortfolio: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Work = mongoose.model('Work', workSchema);
export default Work;
