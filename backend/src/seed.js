const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/task.model');

dotenv.config();

const sampleTasks = [
  {
    title: 'Design UI mockup and color palette',
    description: 'Create responsive component wireframes with Tailwind CSS slate and indigo color tones.',
    status: 'Completed',
    priority: 'High',
  },
  {
    title: 'Configure MongoDB database connection',
    description: 'Establish Mongoose connection with error handling and environment variable configs.',
    status: 'Completed',
    priority: 'High',
  },
  {
    title: 'Implement Task filtering and search bar',
    description: 'Add real-time client search and backend regex filter query support for status and priority.',
    status: 'In Progress',
    priority: 'Medium',
  },
  {
    title: 'Setup production CI/CD & deployment pipeline',
    description: 'Deploy Express backend to Render/Railway and React frontend to Vercel/Netlify.',
    status: 'Pending',
    priority: 'High',
  },
  {
    title: 'Write comprehensive API documentation',
    description: 'Document endpoints, request/response JSON schemas, and local installation steps in README.',
    status: 'Pending',
    priority: 'Low',
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

    console.log('[Seed] Clearing existing tasks...');
    await Task.deleteMany({});

    console.log('[Seed] Inserting sample tasks...');
    const inserted = await Task.insertMany(sampleTasks);
    console.log(`[Seed] Successfully seeded ${inserted.length} sample tasks!`);

    await mongoose.disconnect();
    console.log('[Seed] MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
