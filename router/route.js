//Route example set up in different env
const express = require("express");
const app = express();
const axios = require('axios');
//Returns a list of orders ordered by the most recent

//Test post route
    app.post("/", async (req, res) => {
      try {
        return res.send("post route works");
      } catch (error) {
        console.error(error);
      }
    });

module.exports = app;