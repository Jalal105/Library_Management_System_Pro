/**
 * One-time migration script:
 * Drops the old `rollNumber_1` unique index from the students collection.
 * Run once with: node scripts/dropRollNumberIndex.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/library_db';

async function dropIndex() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('students');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        const hasIndex = indexes.some(i => i.name === 'rollNumber_1');
        if (hasIndex) {
            await collection.dropIndex('rollNumber_1');
            console.log('✅ Successfully dropped rollNumber_1 index');
        } else {
            console.log('ℹ️  rollNumber_1 index not found — nothing to drop');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

dropIndex();
