//Route example set up in different env
const express = require("express");
const app = express();
const axios = require('axios');
//Returns a list of orders ordered by the most recent
app.get("/contacts", async (req, res) => {
    const contacts = `'https://api.hubapi.com/crm/v3/objects/contacts?limit=10&paginateAssociations=false&archived=false&hapikey=${process.env.HUBSPOT_API_KEY}'`
      try {
        const resp = await axios.get(contacts);
        const data = resp.data;
        res.json(data);
      } catch (error) {
        console.log(error);
      }
    });
//Test post route
    app.post("/", async (req, res) => {
      try {
        return res.send("post route works");
      } catch (error) {
        console.error(error);
      }
    });

module.exports = app;