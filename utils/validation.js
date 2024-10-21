const { z } = require('zod');

// User Validation Schema
const userSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    mobile: z.string().regex(/^\d{10}$/, { message: 'Invalid mobile number. Must be 10 digits.' })
});

// Expense Validation Schema
const expenseSchema = z.object({
    description: z.string().min(1, { message: 'Description is required' }),
    amount: z.number().positive({ message: 'Amount must be positive' }),
    paidBy: z.string().min(1, { message: 'PaidBy (User ID) is required' }),
    splitType: z.enum(['equal', 'exact', 'percentage']),
    participants: z.array(z.object({
        user: z.string().min(1, { message: 'User ID is required' }),
        amount: z.number().optional(),
        percentage: z.number().optional().refine(val => (val ? val >= 0 && val <= 100 : true), {
            message: 'Percentage must be between 0 and 100',
        }),
    }))
    .refine((participants, context) => {
        const { splitType } = context.parent;
        if (splitType === 'percentage') {
            const totalPercentage = participants.reduce((sum, p) => sum + (p.percentage || 0), 0);
            return totalPercentage === 100;  // Ensure percentages add up to 100
        } else if (splitType === 'exact') {
            const totalAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0);
            return totalAmount === context.parent.amount;  // Ensure exact amounts sum to the total
        }
        return true;  // No additional check for 'equal'
    }, { message: 'Invalid split: Percentages must add up to 100% or Exact amounts must equal the total amount' }),
});

module.exports = { userSchema, expenseSchema };
