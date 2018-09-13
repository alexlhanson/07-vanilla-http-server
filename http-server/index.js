'use strict';

// Local Library
const server = require('./src/app.js');

let port = process.env.PORT || 3000;

// Fire up the server, on the port that we pulled out of our .env file
// Note that there is NO default port given!
server.start( port, () => console.log(`Server up on ${port}`))
