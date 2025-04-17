const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Models
const User = require('../models/user.model');
const PersonalityTrait = require('../models/personality-trait.model');
const PsychologicalProfile = require('../models/psychological-profile.model');

async function generateTestData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create test admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            email: 'admin@zenaura.com',
            password: adminPassword,
            role: 'admin',
            name: 'Admin User'
        });
        console.log('Created admin user');

        // Create test regular user
        const userPassword = await bcrypt.hash('user123', 10);
        const user = await User.create({
            email: 'user@zenaura.com',
            password: userPassword,
            role: 'user',
            name: 'Test User'
        });
        console.log('Created regular user');

        // Generate tokens
        const adminToken = jwt.sign(
            { _id: admin._id, role: 'admin' },
            config.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userToken = jwt.sign(
            { _id: user._id, role: 'user' },
            config.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Create test personality traits
        const traits = await PersonalityTrait.create([
            {
                name: 'Openness',
                description: 'Openness to experience',
                category: 'Big Five',
                measurementScale: {
                    min: 0,
                    max: 100,
                    unit: 'percentage'
                },
                metadata: {
                    createdBy: admin._id,
                    status: 'active'
                }
            },
            {
                name: 'Conscientiousness',
                description: 'Being careful and diligent',
                category: 'Big Five',
                measurementScale: {
                    min: 0,
                    max: 100,
                    unit: 'percentage'
                },
                metadata: {
                    createdBy: admin._id,
                    status: 'active'
                }
            }
        ]);
        console.log('Created personality traits');

        // Create test psychological profile
        const profile = await PsychologicalProfile.create({
            user: user._id,
            traitScores: [
                {
                    trait: traits[0]._id,
                    score: 75
                }
            ],
            metadata: {
                status: 'draft'
            },
            consent: {
                dataUsage: true,
                research: true,
                consentedAt: new Date()
            }
        });
        console.log('Created psychological profile');

        // Output test data
        console.log('\nTest Data Summary:');
        console.log('==================');
        console.log('Admin Token:', adminToken);
        console.log('\nUser Token:', userToken);
        console.log('\nAdmin ID:', admin._id);
        console.log('User ID:', user._id);
        console.log('\nTrait IDs:');
        traits.forEach(trait => console.log(`${trait.name}: ${trait._id}`));
        console.log('\nProfile ID:', profile._id);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');

    } catch (error) {
        console.error('Error generating test data:', error);
        process.exit(1);
    }
}

generateTestData(); 