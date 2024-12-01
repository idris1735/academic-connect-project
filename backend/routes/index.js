const authRoutes = require('./auth');
// const userRoutes = require('./userRoutes');

module.exports = (app) => {
    const express = require('express');
    const router = express.Router();

    router.use('/auth', authRoutes(app)); // Pass app instance to auth routes
    // router.use('/user', userRoutes(app)); // Pass app instance to user routes

    return router;
};
