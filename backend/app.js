const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth'); // nou

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);
