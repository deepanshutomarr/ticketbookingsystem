const Seat = require('../models/seats.model');

const Controller = async (req, res) => {
  const { numOfSeats } = req.body;
  if (numOfSeats > 7) {

    return res.status(400).json({ message: 'You cannot book more than 7 seats as allowed' });
  }

  try {
    const availableSeats = await Seat.find({ isBooked: false })
      .sort({ rowNumber: 1, seatNumber: 1 });

    if (availableSeats.length < numOfSeats) {

      return res.status(500).json({ message: `Booking failed beacuse only ${availableSeats.length} seats available.` });
    }

    const rowCount = 12;

    for (let row = 1; row <= rowCount; row++) {
      const rowSeats = availableSeats.filter(seat => seat.rowNumber === row);

      const falseCount = rowSeats.reduce((count, seat) => count + (!seat.isBooked ? 1 : 0), 0);

      if (falseCount >= numOfSeats) {
        const availableToBook = rowSeats.filter(seat => !seat.isBooked).slice(0, numOfSeats);
      
        for (let i = 0; i < availableToBook.length; i++) {
          const seat = availableToBook[i];
          seat.isBooked = true;
          await seat.save();
        }
      
        return res.status(200).json({ data: availableToBook });
      }
    }

    let arr = [];
    for (let row = 1; row <= rowCount; row++) {

      const rowSeats = availableSeats.filter(seat => seat.rowNumber === row);

      const falseCount = rowSeats.reduce((count, seat) => count + (!seat.isBooked ? 1 : 0), 0);

      arr.push(falseCount);
    }

    let minLength = Infinity;
    let minStart = -1;
    let minEnd = -1;
    let start = 0;
    let end = 0;
    let sum = 0;

    while (end < arr.length) {

      sum += arr[end];

      while (sum >= numOfSeats) {

        let length = end - start + 1;
        
        if (length < minLength) {
          minLength = length;
          minStart = start;
          minEnd = end;
        }
        
        sum -= arr[start];
        
        start++;
      }

      end++;
    }

    let finalArray = []
    for (let row = minStart + 1; row <= minEnd + 1; row++) {
      const rowSeats = availableSeats.filter(seat => { if (seat.rowNumber === row) { finalArray.push(seat) } });
    }
    finalArray = finalArray.slice(0, numOfSeats)

    for (let i = 0; i < finalArray.length; i++) {
      const seat = finalArray[i];
      seat.isBooked = true;
      await seat.save();
    }

    if (finalArray) {
      return res.status(200).json({ data: finalArray });
    }

    return res.status(500).json({ message: 'Booking failed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSeats = async (req, res) => {
  try {

    const availableSeats = await Seat.find()
      .sort({ rowNumber: 1, seatNumber: 1 });
    return res.status(200).json({ availableSeats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const resetSeatsController = async (req, res) => {
  try {
    await Seat.deleteMany();

    const totalRows = 12;
    const seatsPerRow = 7;

    const seats = [];

    let count = 0
    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = row === totalRows ? 80 % seatsPerRow : seatsPerRow;

      for (let seatNum = 1; seatNum <= rowSeats; seatNum++) {
        count++

        const isBooked = false;

        const newSeat = new Seat({
          seatNumber: count,
          rowNumber: row,
          isBooked,
        });

        seats.push(newSeat);
      }
    }

    await Seat.insertMany(seats);

    return res.json({ message: 'data reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { Controller, resetSeatsController, getSeats };
