const path = require('path');
const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect, sql } = require("./db.config.js");

const app = express();
const PORT = 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database connection
connect()
    .then(() => {
        console.log("Connected to the database.");
    })
    .catch((error) => {
        console.log("Database connection failed!");
        console.log(error);
    });

// Serve dashboard HTML
app.get('/', (req, res) => {
    const dashboardPath = path.join(__dirname, '../public/dashboard.html');
    res.sendFile(dashboardPath);
});

app.get('/users', async (req, res) => {
    try {
        const pool = await connect();
        const result = await pool.request().query('SELECT * FROM users'); // Change table name if needed
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});
app.post('/add-user', async (req, res) => {
    const { Name, Email, Phone, Age, City } = req.body;
    try {
        const pool = await connect();
        await pool.request()
            .input('Name', sql.VarChar, Name)
            .input('Email', sql.VarChar, Email)
            .input('Phone', sql.VarChar, Phone)
            .input('Age', sql.Int, Age)
            .input('City', sql.VarChar, City)
            .query(`
        INSERT INTO users (Name, Email, Phone, Age, City)
        VALUES (@Name, @Email, @Phone, @Age, @City)
      `);
        res.status(200).send('User added');
    } catch (error) {
        console.error('Insert failed:', error);
        res.status(500).send('Error adding user');
    }
});

app.delete('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const pool = await connect();
        await pool.request()
            .input('Id', sql.Int, userId)
            .query('DELETE FROM Users WHERE Id = @Id');
        res.status(200).send('User deleted');
        const result = await pool.request()
            .input('Id', sql.Int, userId)
            .query('DELETE FROM Users WHERE Id = @Id');

        console.log('Deleted rows count:', result.rowsAffected);

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Failed to delete user');
    }
});
app.put('/update-user/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { Name, Email, Phone, Age, City } = req.body;

    try {
        const pool = await connect();
        await pool.request()
            .input('Id', sql.Int, userId)
            .input('Name', sql.NVarChar, Name)
            .input('Email', sql.NVarChar, Email)
            .input('Phone', sql.NVarChar, Phone)
            .input('Age', sql.Int, Age)
            .input('City', sql.NVarChar, City)
            .query(`
        UPDATE Users 
        SET Name = @Name, Email = @Email, Phone = @Phone, Age = @Age, City = @City 
        WHERE Id = @Id
      `);
        res.status(200).send('User updated');
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).send('Update failed');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
