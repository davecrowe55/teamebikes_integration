//Route example set up in different env
const express = require("express");
const app = express();


//TEST POST ROUTE
app.post("/", async (req, res) => {
  try {
    return res.send("GREAT SUCCESS no");
  } catch (error) {
    console.error(error);
  }
});

module.exports = app;