# Manual Expense Tracker

## About

The **Manual Expense Tracker** is a web-based application designed to help users track their income and expenses. Users can manually add income and expenses, view detailed analytics of their spending patterns, and monitor their overall financial health. This application provides features like adding money, adding expenses, visualizing data with charts, and securely managing user accounts.

### Built By:
- **Students of VRSEC**

## Features

- **User Authentication:**
  - Secure login and registration with password hashing.
  - Session-based authentication to protect user data.

- **Income and Expense Tracking:**
  - Add income with details like note, amount, and date.
  - Add expenses with details like note, amount, category, and date.
  - Categories for expenses (e.g., Food, Entertainment, Utilities).

- **Analytics:**
  - Pie chart visualizing the breakdown of expenses by category.
  - Line graph showing income and expenses over time.
  - Summary data showing total income, total expenses, and current balance.

- **Responsive Design:**
  - The app works well on both desktop and mobile devices.

- **Security:**
  - User passwords are hashed using bcrypt for secure storage.
  - Sessions are used to maintain user login status.

- **Easy Navigation:**
  - Clear and intuitive UI with separate pages for adding income, adding expenses, and viewing analytics.
  - Quick access to the home page from anywhere in the application.

## Setup

To run this project locally, follow the steps below:

### Prerequisites

1. **Node.js** (Version 12 or higher)
2. **SQLite3** (For the database)
3. **Express** (For server.js)
4. **Session** (For server.js)
5. **bcrypt** (For password encryption)
6. **Path** (For managing Directories)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/manual-expense-tracker.git
   ```

2. **Navigate to the project folder**:
   ```bash
   cd manual-expense-tracker
   ```

3. **Install the required dependencies**:
   ```bash
   npm install node sqlite3 express express-session bcrypt path
   ```

4. **Setup SQLite Database**:
   The application will automatically create a database (`database.db`) and necessary tables when it starts up.

5. **Run the application**:
   ```bash
   npm server.js
   ```
   This will start the server on port 3000 by default. You can visit the application at `http://localhost:3000`.

### Database

The database `database.db` will be created automatically upon starting the server. It contains two main tables:

- **users**: Stores user login credentials (username and password).
- **transactions**: Stores income and expense transactions associated with each user.

## How to Use

1. **Register an Account**: 
   - Go to the login page and create a new account by entering a username and password.

2. **Login**: 
   - Use your credentials to log into the application.

3. **Add Income**: 
   - Once logged in, go to the "Add Money" section to input your income details.

4. **Add Expenses**: 
   - Go to the "Add Expense" section to track your expenses, including choosing a category.

5. **View Analytics**: 
   - Check the "Analytics" page for a graphical overview of your finances.

6. **Logout**: 
   - You can log out of your account from any page.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: bcrypt for password hashing
- **Data Visualization**: Chart.js for analytics charts

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
