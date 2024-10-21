const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    splitType: {
        type: String,
        enum: ['equal', 'exact', 'percentage'],
        required: true,
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        amount: {
            type: Number,
        },
        percentage: {
            type: Number,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
