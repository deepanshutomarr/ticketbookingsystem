const express = require('express');
const router = express.Router();
const { Controller, resetSeatsController, getSeats } = require('../controller/seats.controller');

router.post('/', resetSeatsController)

router.get('/', getSeats);

router.post('/book', Controller);

module.exports = router;
