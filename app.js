require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const http = require('http');
const stripe = require('stripe')(process.env.StripKey);

const userRoutes = require('./routes/UserRoutes');
const emotionJournalRoutes = require('./routes/emotionJournalRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const therapistRoutes = require('./routes/therapists');

const app = express();
const server = http.createServer(app);

// CORS settings
const allowedOrigins = [
  "http://localhost:5173", // Development
  process.env.URL, // Production (dynamically fetched from .env)
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/journals', emotionJournalRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/therapists', therapistRoutes);

app.use('/welcome', (req, res) => {
  res.send('your application deployed successfully');
})

app.post('/paymentCheckout', async (req, res) => {
  const Data = req.body;

  if (!Data.therapistId || !Data.appointmentDate || !Data.amount) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'INR',
          product_data: {
            name: 'Therapy Session',
          },
          unit_amount: Math.round(Data.amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.URL}/success?appointmentData=${Data.appointmentDate}&sharedNotes=${encodeURIComponent(Data.sharedNotes)}&therapistId=${encodeURIComponent(Data.therapistId)}`,
      cancel_url: `${process.env.URL}/failure`,
      metadata: { email: Data.user.email },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB using the URI from the environment variables
mongoose.connect(process.env.Mongodb_URI)
  .then(conn => {
    console.log(`MongoDB connected: ${conn.connection.host}`);
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Server setup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
