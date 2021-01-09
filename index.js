require('dotenv').config();
const express = require('express');
const request = require('request-promise-native');
const NodeCache = require('node-cache');
const session = require('express-session');
const opn = require('open');
const axios = require('axios');
const ajax = ('ajax-request');
const app = express();
const route = require("./router/route");


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/route", route);



const PORT = process.env.PORT;


const refreshTokenStore = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });




if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    throw new Error('Missing CLIENT_ID or CLIENT_SECRET environment variable.')
}

//===========================================================================//
//  HUBSPOT APP CONFIGURATION
//
//  All the following values must match configuration settings in your app.
//  They will be used to build the OAuth URL, which users visit to begin
//  installing. If they don't match your app's configuration, users will
//  see an error page.

// Replace the following with the values from your app auth config, 
// or set them as environment variables before running.
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_KEY = process.env.API_KEY;
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const PIPEDREAM_TOKEN = process.env.PIPEDREAM_TOKEN;
// Scopes for this app will default to `contacts`
// To request others, set the SCOPE environment variable instead
let SCOPES = ['contacts','e-commerce', 'hubdb' ];
if (process.env.SCOPE) {
    SCOPES = (process.env.SCOPE.split(/ |, ?|%20/)).join(' ');
}

// On successful install, users will be redirected to /oauth-callback
const REDIRECT_URI = `http://localhost:3000/oauth-callback`;

//===========================================================================//

// Use a session to keep track of client ID
app.use(session({
  secret: Math.random().toString(36).substring(2),
  resave: false,
  saveUninitialized: true
}));
 
//================================//
//   Running the OAuth 2.0 Flow   //
//================================//

// Step 1
// Build the authorization URL to redirect a user
// to when they choose to install the app
const authUrl = 'https://app.hubspot.com/oauth/authorize' +
`?client_id=9ba67b99-04c4-409d-9a14-07e9aff6a95b` +
`&redirect_uri=http://localhost:3000/oauth-callback&scope=contacts%20hubdb%20e-commerce`;



// Redirect the user from the installation page to
// the authorization URL
app.get('/install', (req, res) => {
  console.log('');
  console.log('=== Initiating OAuth 2.0 flow with HubSpot ===');
  console.log('');
  console.log("===> Step 1: Redirecting user to your app's OAuth URL");
  res.redirect(authUrl);
  console.log('===> Step 2: User is being prompted for consent by HubSpot');
});

// Step 2
// The user is prompted to give the app access to the requested
// resources. This is all done by HubSpot, so no work is necessary
// on the app's end

// Step 3
// Receive the authorization code from the OAuth 2.0 Server,
// and process it based on the query parameters that are passed
app.get('/oauth-callback', async (req, res) => {
  console.log('===> Step 3: Handling the request sent by the server');

  // Received a user authorization code, so now combine that with the other
  // required values and exchange both for an access token and a refresh token
  if (req.query.code) {
    console.log('       > Received an authorization token');

    const authCodeProof = {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: req.query.code
    };

    // Step 4
    // Exchange the authorization code for an access token and refresh token
    console.log('===> Step 4: Exchanging authorization code for an access token and refresh token');
    const token = await exchangeForTokens(req.sessionID, authCodeProof);
    if (token.message) {
      return res.redirect(`/error?msg=${token.message}`);
    }

    // Once the tokens have been retrieved, use them to make a query
    // to the HubSpot API
    res.redirect(`/`);
  }
});

//==========================================//
//   Exchanging Proof for an Access Token   //
//==========================================//

const exchangeForTokens = async (userId, exchangeProof) => {
  try {
    const responseBody = await request.post('https://api.hubapi.com/oauth/v1/token', {
      form: exchangeProof
    });
    // Usually, this token data should be persisted in a database and associated with
    // a user identity.
    const tokens = JSON.parse(responseBody);
    refreshTokenStore[userId] = tokens.refresh_token;
    accessTokenCache.set(userId, tokens.access_token, Math.round(tokens.expires_in * 0.75));

    console.log('       > Received an access token and refresh token');
    return tokens.access_token;
  } catch (e) {
    console.error(`       > Error exchanging ${exchangeProof.grant_type} for access token`);
    return JSON.parse(e.response.body);
  }
};

const refreshAccessToken = async (userId) => {
  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: refreshTokenStore[userId]
  };
  return await exchangeForTokens(userId, refreshTokenProof);
};

const getAccessToken = async (userId) => {
  // If the access token has expired, retrieve
  // a new one using the refresh token
  if (!accessTokenCache.get(userId)) {
    console.log('Refreshing expired access token');
    await refreshAccessToken(userId);
  }
  return accessTokenCache.get(userId);
};

const isAuthorized = (userId) => {
  return refreshTokenStore[userId] ? true : false;
};

//====================================================//
//   Using an Access Token to Query the HubSpot API   //
//====================================================//
// get contacts //
const getContact = async (accessToken) => {
  console.log('');
  console.log('=== Retrieving a contact from HubSpot using the access token ===');
  try {
    let headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    console.log('===> request.get(\'https://api.hubapi.com/contacts/v1/lists/all/contacts/all\')');
    let result = await request.get('https://api.hubapi.com/contacts/v1/lists/all/contacts/all', {
      headers: headers
    });
    
    return JSON.parse(result).contacts[2];
    ;
  } catch (e) {
    console.error('  > Unable to retrieve contact');
    return JSON.parse(e.response.body);
  }
};

// get deals //
const getDeal = async (accessToken) => {
  console.log('');
  console.log('=== Retrieving deals from HubSpot using the access token ===');
  try {
    let headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    console.log('===> request.get(\'https://api.hubapi.com/crm/v3/objects/deals)');
    let result = await request.get('https://api.hubapi.com/crm/v3/objects/deals/', {
      headers: headers
    });
    return JSON.parse(result).results[0];
    
  } catch (e) {
    console.error('  > Unable to retrieve deals');
    return JSON.parse(e.response.body);
  }
};

//get hub db table
const getHubdb = async (accessToken) => {
  console.log('');
  console.log('=== Retrieving deals from HubSpot using the access token ===');
  try {
    let headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    console.log('===> request.get(\'https://api.hubapi.com/cms/v3/hubdb/tables?)');
    let result = await request.get('https://api.hubapi.com/cms/v3/hubdb/tables?', {
      headers: headers
    });
    return JSON.parse(result).results[0];
    
  } catch (e) {
    console.error('  > Unable to retrieve deals');
    return JSON.parse(e.response.body);
  }
};
// get vend web hook payload
const getPageInfo = async (accessToken) => {
  //  console.log('');
  console.log('=== Retrieving payload from Vend using the access token ===');
  try {
    let headers = {
      Authorization: `Bearer ${PIPEDREAM_TOKEN}`,// Authorized by PIPEDREAM_TOKEN, difficulty getting correct access to env and to write payload :<
      'Content-Type': 'application/json'
    };
    console.log('===> request.get(\'https://api.pipedream.com/v1/sources/dc_v3upnvA/event_summaries?expand=event)');
    let result = await request.get('https://api.pipedream.com/v1/sources/dc_v3upnvA/event_summaries?expand=event', {
      headers: headers
    });
      // console.log(result);
    return JSON.parse(result).data[0];
  } catch (e) {
    console.error('  > Unable to retrieve deals');
    return JSON.parse(e.response.body);
  }
};



//========================================//
//   Displaying information to the user   //
//========================================//
//Display contacts
const displayContactName = (res, contact) => {
  if (contact.status === 'error') {
    res.write(`<p>Unable to retrieve contact! Error Message: ${contact.message}</p>`);
    return;
  }
  const { firstname, lastname } = contact.properties;
  console.log(contact.properties);
  res.write(`<p>Contact name: ${firstname.value} ${lastname.value} </p>`);
};
//Display deals
const displayDeal = (res, deal) => {
  if (deal.status === 'error') {
    res.write(`<p>Unable to retrieve the deals! Error Message: ${deal.message}</p>`);
    return;
  }
  const { dealname, amount } = deal.properties;
  console.log(deal.properties);
  res.write(`<p>Deal information: ${dealname} ${amount} </p>`);
};
//Display hubdb
const displayHubdb = (res, db) => {
  if (db.status === 'error') {
    res.write(`<p>Unable to retrieve the deals! Error Message: ${db.message}</p>`);
    return;
  }
  
  console.log(db);
  res.write(`<p>db information: ${db}  </p>`);
};
// Display payLoad
const displayPageInfo = (res, data) => {
    //  console.log(data);
  if (data.status === 'error') {
    res.write(`<p>Unable to retrieve the deals! Error Message: ${data.message}</p>`);
    return;
  }
    // const { id } = data.properties;
   console.log(data);
  res.write(`<p>pageinfo information: ${ data }  </p>`);
};

//Display data
app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h2> DAVID'S BIGTEST testHubSpot OAuth 2.0 Quickstart App  login button test;`);
  res.write(`<h2> DAVID'S BIGTEST testHubSpot OAuth 2.0 Quickstart App  login button test ;`);
  // res.render(<button onClick="handleSignIn()">LOGIN </button>);
  if (isAuthorized(req.sessionID)) {
    const accessToken = await getAccessToken(req.sessionID);
    const contact = await getContact(accessToken);
    const deal = await getDeal(accessToken);
    const db = await getHubdb(accessToken); //Auth issues doesn't allow public api display?
    const pageInfor = await getPageInfo(accessToken); //Auth issues coming from pipedream, different auth, when coming straight from webhook should work???
    res.write(`<h4>Access token: ${accessToken}</h4>`);
    displayContactName(res, contact);
    displayDeal(res, deal);
    displayHubdb(res, db);
    displayPageInfo(res, pageInfor);
  } else {
    res.write(`<a href="/install"><h3>Install the app</h3></a>`);
  }
  res.end();
});

app.get('/error', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
});

app.listen(PORT, () => console.log(`=== Starting your app on http://localhost:${PORT} ===`));
opn(`http://localhost:${PORT}`);



module.exports = app;

