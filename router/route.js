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

         
//
// var options = { method: 'POST',
//   url: 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all',
//   qs: { hapikey: 'process.env.API_KEY' },
//   headers: 
//    { 
//      'Content-Type': 'application/json' },
//   body: 
//    { properties: 
//       [ { property: 'email', value: 'testingapis@hubspot.com' },
//         { property: 'firstname', value: 'test' },
//         { property: 'lastname', value: 'testerson' },
//         { property: 'website', value: 'http://hubspot.com' },
//         { property: 'company', value: 'HubSpot' },
//         { property: 'phone', value: '555-122-2323' },
//         { property: 'address', value: '25 First Street' },
//         { property: 'city', value: 'Cambridge' },
//         { property: 'state', value: 'MA' },
//         { property: 'zip', value: '02139' } ] },
//   json: true };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });


// // TEST POST ROUTE
// // Should refactor
// app.post("/", async (req, res) => {
//   try {
//     //console.log(req.user);
//     const payLoad = req.payload[`https://api.hubapi.com/contacts/v1/lists/all/contacts/all`]
//     const {firstname, lastname} = req.body;
//     console.log(payload)
//     if (
//       firstname === undefined ||
//       lastname === undefined
//     ) {
//       return res.status(400).send("Bad Request - missing parameter/s THIS AINT WORKING");
//     }
//     // console.log(getUserIdByEmail)
    
//     // create new payload
//     createNewContact(firstname, lastname);

//     res.status(201).json("OK - Hubspot was updated");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("GREAT success yes").end();
//   }
// });

module.exports = app;