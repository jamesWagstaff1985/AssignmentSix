/*
  Build a rest JSON api that listens on a port
  and returns a welcome message
*/

// Dependencies
const http = require('http');
const url = require('url');
const cluster = require('cluster');
const os = require('os');

// Create the server
const httpServer = http.createServer((req, res)=> {
    // parse the url
    const parsedUrl = url.parse(req.url, true)
    // Get the path name and strip any slashes
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')

    // Get the persons name from the path name, if none, default to World
    const name = typeof(parsedUrl.query.name) == 'string' ? parsedUrl.query.name : 'World';

    // Check the path is valid, if not send to notFound handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Form the data object
    const data = {
      'name' : name
    }

      // Route the request to the handler specified in the router
      chosenHandler(data, (statusCode, payload)=>{
        // Use the status code returned from the handler or default to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : '200';

        // Use the payload returned from the handler or default to an empty object
        payload = typeof(payload) == 'object' ? payload : {};

        // Convert the payload to a string
        const payloadString = JSON.stringify(payload);

         // Return the response
         res.setHeader('Content-Type', 'application/json');
         res.writeHead(statusCode);
         res.end(payloadString);
      })
})

// Initialize the API
Init = () => {
  if(cluster.isMaster){
    for(cpu in os.cpus()){
      cluster.fork();
    }
  }else{
    // Start listening on the server
    httpServer.listen(3000, (req, res)=>{
      console.log("WE ARE LISTENING ON PORT 3000")
    });
  }
}

// Call the Init function
Init();

// Define an object to store the handlers
let handlers = {}

handlers.helloworld = (data, callback) => {
  const message = {
    'Message' : 'Hello '+data.name
  }
  callback(200, message)
}
handlers.notFound = (data, callback) => {
  callback(404, {'Error':'Page not found'})
}

// Object for routing all requests to specified handler
const router = {
  'helloworld' : handlers.helloworld,
  'notFound'   : handlers.notFound
}
