//Route example set up in different env
const express = require("express");
const app = express();


//TEST POST ROUTE
app.post("/", async (req, res) => {
  try {
    return res.send("GREAT SUCCESS IN route.js");
  } catch (error) {
    console.error(error);
  }
});

// app.post("/", async (req, res) => {
  
//   let headers = `Bearer ${accessToken}`;
//   const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
//   const propUpdate = {
//     "properties": [ {
//       "firstname": "Anothertestname",
//       "lastname": "Anothertestlastname"
//     }
//     ]
//   }
//   const apiCall = `https://api.hubapi.com/contacts/v1/lists/all/contacts/all/?hapikey=${process.env.HUBSPOT_API_KEY}`;
//   try {
//     await axios.post(apiCall, propUpdate);
//     console.log(propUpdate, apiCall);
//   } catch (error) {
//     console.error(error);
//   }
// });

// app.post("/", async (req, res) => {
//   try {
//     return res.send("GREAT SUCCESS IN route.js");
//   } catch (error) {
//     console.error(error);
//   }
// });

module.exports = app;