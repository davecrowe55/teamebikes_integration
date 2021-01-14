//Route example set up in different env
const express = require("express");
const app = express();
const axios = require('axios');
//Returns a list of orders ordered by the most recent

//Test button route
// app.get('/', async (req, res) => {
//   res.setHeader('Content-Type', 'text/html');
//   res.write(`<h2> DAVID'S BIGTEST testHubSpot OAuth XXXX.0 Quickstart App  login button test;`);
//   res.write("<input type='button' id='butTest' value='Login Database' onclick='location.href=\"route.js");
//   // res.render(<button onClick="handleSignIn()">LOGIN </button>);onClick="handleSignIn()">LOGI
 
//   res.end();
// });
//Need to extract payload from vend webhook and post it to hubspot?
app.post("/", async (req, res) => {
  try { const vendWebHook = req.body[`https://ebiketeam.vendhq.com/api/webhooks/`];
  console.log(req.body);
        const { id } = req.body;
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