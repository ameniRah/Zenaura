const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Increase timeout for all tests
jest.setTimeout(30000);

// Connect to the in-memory database before all tests
beforeAll(async () => {
  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // Create a new MongoDB memory server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Connect to the in-memory database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
});

// Clear all test data after each test
beforeEach(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      const collections = await mongoose.connection.db.collections();
      for (let collection of collections) {
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.error('Error clearing test database:', error);
    throw error;
  }
});

// Disconnect and stop the server after all tests
afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error closing test database:', error);
    throw error;
  }
}); 