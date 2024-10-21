const Expense = require('../models/Expense');
const { expenseSchema } = require('../utils/validation');
const { z } = require('zod');
const fs = require('fs');
const path = require('path');

// Helper function to calculate splits
const calculateSplits = (amount, splitType, participants) => {
    let updatedParticipants = [];

    switch (splitType) {
        case 'equal':
            const equalShare = amount / participants.length;
            updatedParticipants = participants.map(participant => ({
                user: participant.user,
                amount: equalShare,
            }));
            break;

        case 'exact':
            updatedParticipants = participants.map(participant => ({
                user: participant.user,
                amount: participant.amount,
            }));
            break;

        case 'percentage':
            updatedParticipants = participants.map(participant => ({
                user: participant.user,
                amount: (amount * participant.percentage) / 100,
            }));
            break;

        default:
            throw new Error('Invalid split type');
    }

    return updatedParticipants;
};

// Add Expense
exports.addExpense = async (req, res) => {
    try {
        // Validate request body
        const validatedData = expenseSchema.parse(req.body);
        const { description, amount, paidBy, splitType, participants } = validatedData;

        // Calculate the splits
        const updatedParticipants = calculateSplits(amount, splitType, participants);

        const newExpense = new Expense({
            description,
            amount,
            paidBy,
            splitType,
            participants: updatedParticipants,
        });

        await newExpense.save();
        res.status(201).json(newExpense);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: 'Error adding expense' });
    }
};

// Get Individual User Expenses
exports.getUserExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ 'participants.user': req.params.userId })
                                      .populate('paidBy', 'name email')
                                      .populate('participants.user', 'name email');
        res.status(200).json(expenses);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching user expenses' });
    }
};

// Get Overall Expenses
exports.getOverallExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find()
                                      .populate('paidBy', 'name email')
                                      .populate('participants.user', 'name email');
        res.status(200).json(expenses);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching overall expenses' });
    }
};

// Download Balance Sheet as CSV
exports.downloadBalanceSheet = async (req, res) => {
    try {
        const expenses = await Expense.find()
                                      .populate('paidBy', 'name email')
                                      .populate('participants.user', 'name email');
        
        const filePath = path.join(__dirname, '../public/balance-sheet.csv');
        let csvData = 'Expense Description,Total Amount,Paid By,Participant,Amount Owed\n';

        expenses.forEach(expense => {
            expense.participants.forEach(participant => {
                csvData += `${expense.description},${expense.amount},${expense.paidBy.name},${participant.user.name},${participant.amount}\n`;
            });
        });

        fs.writeFileSync(filePath, csvData);
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ error: 'Error generating balance sheet' });
    }
};
