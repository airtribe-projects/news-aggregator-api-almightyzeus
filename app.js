require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const usersRoute = require('./routes/usersRoute');
const preferencesRoute = require('./routes/preferencesRoute');
const newsRouter = require('./routes/newsRoute');
const app = express();
// Connect to DB
connectDB && connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// User routes
app.use('/users', usersRoute);
// Preferences routes
app.use('/preferences', preferencesRoute);
// News routes
app.use('/news', newsRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${PORT}`);
});



module.exports = app;