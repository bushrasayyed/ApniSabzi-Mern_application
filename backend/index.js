const data = require("./data");
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




app.use("/api/seed",  require("./routes/seedRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use(express.json());
//  Available Routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/editor", require("./routes/editor"));

app.get('/api/products',(req,res)=>{
  res.send(data.products);
  
  });

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});