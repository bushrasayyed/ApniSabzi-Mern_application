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



app.use(express.json());

//  Available Routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/editor", require("./routes/editor"));

app.get('/api/products',(req,res)=>{
  res.send(data.products);
  
  });
  app.get('/api/products/slug/:slug', (req, res) => {
      const product = data.products.find((x) => x.slug === req.params.slug);
      if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    });
  
    app.get('/api/products/:id', (req, res) => {
      const product = data.products.find((x) => x._id === req.params.id);
      if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    });
  



app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
