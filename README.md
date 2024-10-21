


## Daily Expenses Sharing Application
Features:
1. User Management: Allows creating and retrieving user details.
2. Expense Management: Supports adding expenses and retrieving individual or overall expenses.
3. Expense Splitting: Offers three types of expense splits: equal, exact, and percentage-based.
4. Input Validation: Utilizes Zod for validating user inputs to ensure proper data formats.
5 . Downloadable Balance Sheet: Provides an option to download the balance sheet as a CSV file for easy tracking.
# Tech Stack:
Node.js
Express.js
MongoDB
Zod for input validation
# Setup:
Clone the project repository and navigate to the project folder.
Install necessary dependencies using the npm install command.
Set up environment variables by creating a .env file. Inside this file, add the MongoDB connection URI.
Start the server with the npm start command.
Use Postman or any API client to test the API and ensure everything is working.
Troubleshooting Example:
If you send a request with invalid user IDs for participants, such as trying to add an expense where the payer or participants have incorrect or non-existent user IDs, you will get an error response like: "Some users do not exist."

# To fix this:

Ensure that all User IDs being passed are valid by checking the user records in MongoDB using a tool like MongoDB Compass or by querying the database.
Check the server logs for detailed error messages if the issue persists.
Once the user IDs are valid, the expense will be successfully created.