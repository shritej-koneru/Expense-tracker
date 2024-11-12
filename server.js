const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();

// Setup middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  }),
);

// Database setup
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to SQLite database.");
});

// Ensure tables exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    note TEXT,
    amount REAL,
    category TEXT,
    date TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`);

// Function to calculate total income
function getTotalIncome(callback) {
  const query = `
    SELECT SUM(amount) AS total_income 
    FROM transactions 
    WHERE type = 'income';
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      console.error("Error fetching total income:", err.message);
      callback(err, null);
    } else {
      const totalIncome = row.total_income || 0;
      console.log("Default to 0 if null");
      callback(null, totalIncome);
    }
  });
}

// Function to calculate total expenses
function getTotalExpenses(callback) {
  const query = `
    SELECT SUM(amount) AS total_expenses 
    FROM transactions 
    WHERE type = 'expense';
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      console.error("Error fetching total expenses:", err.message);
      callback(err, null);
    } else {
      const totalExpenses = row.total_expenses || 0; // Default to 0 if null
      callback(null, totalExpenses);
    }
  });
}

/* Route to fetch balance data
app.get("/balance", (req, res) => {
  getTotalIncome((err, totalIncome) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch total income" });
    } else {
      getTotalExpenses((err, totalExpenses) => {
        if (err) {
          res.status(500).json({ error: "Failed to fetch total expenses" });
        } else {
          const balance = totalIncome - totalExpenses;
          res.json({
            totalIncome,
            totalExpense: totalExpenses,
            balance,
          });
        }
      });
    }
  });
});*/

// Root route - redirect based on login status
app.get("/", (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/main/index.html"); // Redirect to main page if logged in
  } else {
    res.redirect("/account/login.html"); // Redirect to login page if not logged in
  }
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).send("Server error");
    if (!user) return res.status(400).send("Invalid username or password");

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = { id: user.id, username: user.username };
        res.redirect("/main/index.html");
      } else {
        res.status(400).send("Invalid username or password");
      }
    });
  });
});

// Register route
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send("Server error");

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      (err) => {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            return res.status(400).send("Username already exists");
          }
          return res.status(500).send("Server error");
        }
        res.redirect("/account/login.html");
      },
    );
  });
});

// Protect routes that require authentication
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/account/login.html");
  }
}

// Apply the authentication middleware to the /main routes
app.use("/main", isAuthenticated);

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Could not log out");
    res.redirect("/account/login.html");
  });
});

app.get("/balance", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const userId = req.session.user.id;

  db.get(
    `
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
    FROM transactions
    WHERE user_id = ?`,
    [userId],
    (err, row) => {
      if (err) {
        console.error("Error fetching balance data:", err.message);
        return res.status(500).send("Failed to retrieve balance data");
      }

      const totalIncome = row.totalIncome || 0;
      const totalExpense = row.totalExpense || 0;
      const balance = totalIncome - totalExpense;

      res.json({
        totalIncome: totalIncome.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
        balance: balance.toFixed(2),
      });
    },
  );
});

// Add income route
app.post("/add-income", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const userId = req.session.user.id;
  const { note, amount, date } = req.body;

  console.log("Received income data:", { userId, note, amount, date }); // Log incoming data

  // Insert the income entry into the database
  db.run(
    `INSERT INTO transactions (user_id, type, note, amount, date) VALUES (?, 'income', ?, ?, ?)`,
    [userId, note, amount, date],
    function (err) {
      if (err) {
        console.error("Error inserting income:", err.message);
        return res.status(500).send("Failed to add income");
      }
      console.log("Income added to database with ID:", this.lastID);
      res.send("Income added successfully");
    },
  );
});

app.post("/add-expense", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const userId = req.session.user.id;
  const { note, amount, category, date } = req.body;

  // Calculate balance to ensure expense does not exceed available balance
  db.all(
    `SELECT type, SUM(amount) as total FROM transactions WHERE user_id = ? GROUP BY type`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Error calculating balance:", err.message);
        return res.status(500).send("Server error");
      }

      let totalIncome = 0;
      let totalExpense = 0;

      rows.forEach((row) => {
        if (row.type === "income") totalIncome = row.total;
        else if (row.type === "expense") totalExpense = row.total;
      });

      const balance = totalIncome - totalExpense;

      if (amount > balance) {
        return res.status(400).send("Insufficient balance to add this expense");
      }

      // Insert the expense entry into the database if balance is sufficient
      db.run(
        `INSERT INTO transactions (user_id, type, note, amount, category, date) VALUES (?, 'expense', ?, ?, ?, ?)`,
        [userId, note, amount, category, date],
        function (err) {
          if (err) {
            console.error("Error inserting expense:", err.message);
            return res.status(500).send("Failed to add expense");
          }
          res.send("Expense added successfully");
        },
      );
    },
  );
});

app.get("/analytics-data", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const userId = req.session.user.id;

  db.all(
    `SELECT type, category, amount, date FROM transactions WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching analytics data:", err.message);
        return res.status(500).send("Failed to retrieve analytics data");
      }
      res.json(rows);
    },
  );
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
