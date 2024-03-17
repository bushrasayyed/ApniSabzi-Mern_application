const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");


connectToMongo();
const app = express();
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(express.json());

//  Available Routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/editor", require("./routes/editor"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
