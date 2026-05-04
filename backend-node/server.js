const express = require('express');
const cors = require('cors');

const app = express();
// Menggunakan port 8000 agar sama dengan request di Frontend
const port = 8000; 

// Mengizinkan Frontend (React di port 3000) untuk berkomunikasi dengan Backend ini
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json()); // Untuk memparsing body request berupa JSON

// --- Endpoint Dasar ---
app.get('/', (req, res) => {
  res.json({ message: "Welcome to PharmaMatch AI API (Node.js)" });
});

app.get('/api/health', (req, res) => {
  res.json({ status: "Node.js Backend is running flawlessly!", version: "1.0.0" });
});

// --- Endpoint Login ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Dummy logic untuk verifikasi
  if (email === "dr.sarah@pharmamatch.ai" && password === "password123") {
    res.json({ 
      status: "success", 
      token: "dummy_jwt_token_123", 
      user: { name: "Dr. Sarah J." } 
    });
  } else {
    res.json({ 
      status: "error", 
      message: "Invalid credentials" 
    });
  }
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Node.js Backend running on http://localhost:${port}`);
});
