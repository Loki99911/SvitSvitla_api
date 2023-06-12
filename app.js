const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require("dotenv").config();

const authRouter = require("./routes/api/authRouts");
const productsRouter = require('./routes/api/productsRouts');
const catalogRouter = require("./routes/api/catalogsRouts");
const reviewsRouter = require("./routes/api/reviewsRouts")
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.use("/api/users", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/catalogs", catalogRouter);
app.use("/api/reviews", reviewsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found route' })
})

app.use((err, req, res, next) => {
  const { status = 500, message="Server error" } = err;
  res.status(status).json({ message });
})

module.exports = app;
