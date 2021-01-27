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

// const createNewContact = {
//   method: 'POST',
//       url: 'https://api.hubapi.com/crm/v3/objects/contacts',
//    headers: {
//   accept: 'application/json',
//  'content-type': 'application/json',
//     authorization: 'Bearer CJaHh-7sLhIDAQECGKyuowQg7OqFBijprg4yGQCc-dhwU_mlqAxjW5ySbzL3SFU-qNaP0hs6GgAKAkEAAAyAA_gLAAAAAQAAAAAAAAAYwAATQhkAnPnYcJN-YOa36fH-a-4bA31fnvJFASxX '},
//   body: {
//        properties: {
//       company: 'ABBBBBiglytics',
// email: 'Abcooper@biglytics.net',
//       firstname: 'ABryan',
// lastname: 'ACooper',
//        phone: '(1877) 929-0687',
//       website: 'Abiglytics.net'
//    }
//     },
//   json: true
// };


module.exports = app;