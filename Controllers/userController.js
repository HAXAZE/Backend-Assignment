const User = require('../models/User');
const { userSchema } = require('../utils/validation');
const { z } = require('zod');

exports.createUser = async (req, res) => {
    try {
        // Validate request body
        const validatedData = userSchema.parse(req.body);

        const { name, email, mobile } = validatedData;
        const newUser = new User({ name, email, mobile });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: 'Error creating user' });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching user' });
    }
};
