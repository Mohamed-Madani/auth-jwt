const express = require("express");
const app = express();
const auth = require("./routes/auth");
const port = 3000;

app.use(express.json());

app.use("/auth", auth);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server is running on port 3000!");
});