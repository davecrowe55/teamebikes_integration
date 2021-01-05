//Route example set up in different env
const express = require("express");
const app = express();
const axios = require('axios');
//Returns a list of orders ordered by the most recent

//Need to extract payload from vend webhook
app.post("/", async (req, res) => {
  try { const { id } = req.body[`https://ebiketeam.vendhq.com/api/webhooks/`];
  console.log(req.body);
        // const { id } = req.body;
    if (
      id === undefined
    ) {
      return res.status(400).send("Bad request - missing parameters");
    }
    //create new inventory update
    createInventoryUpdate(vendWebHook ,id);
    res.status(201).json("OK - list was updated");

  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
});

//TEST POST ROUTE
// app.post("/", async (req, res) => {
//   try {
//     return res.send("GREAT SUCCESS");
//   } catch (error) {
//     console.error(error);
//   }
// });

module.exports = app;