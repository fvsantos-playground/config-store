const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./routes');

const db = require('./db');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!!!!');
});

db.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return db.sync();
  }).then(() => {
    console.log('Database synchronized, starting server...');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});