const express = require('express');
const { addExpense, getUserExpenses, getOverallExpenses, downloadBalanceSheet } = require('../Controllers/expenseController');

const router = express.Router();

router.post('/', addExpense);
router.get('/:userId', getUserExpenses);
router.get('/overall', getOverallExpenses);
router.get('/balance-sheet', downloadBalanceSheet)

module.exports = router;
