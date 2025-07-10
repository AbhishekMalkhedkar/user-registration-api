const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'data.json');


function readUsers() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return data ? JSON.parse(data) : [];
}


function writeUsers(users) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2), 'utf8');
}

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

      
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const users = readUsers();

        
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const obj = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword
        };

        users.push(obj);
        writeUsers(users);

        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser.id
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
