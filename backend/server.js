const express = require("express");
const cors = require('cors');
const app = express();
const port = 3000;
const apiRouter = require("./src/api/routes/api");

app.use(cors({
  origin: 'http://localhost:4200', // your Angular app
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-API-Key']
}));

app.use(express.json());
app.use ("/api", apiRouter);
app.get("/health", (req, res) => {
  res.json({ status: "Ok" });
});

app.listen(port, () => console.log(`Server is running on ${port}, root is ${__dirname}`));