var url = require('url');

var messages = require('./messages');
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  // console.log('-------> request is');
  // console.log(request);
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json'; //JSON?

  // console.log(request, "---------------------", response);

  if (request.method === 'GET') {
    var pathname = url.parse(request.url).pathname;
    // console.log(pathname);
    if (pathname !== '/classes/messages') {
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end('NOTHING HERE');
    } else {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      // response.write(JSON.stringify({key:'value'}))
      // console.log('GOT GET REQUEST SUCH WOW', response.statusCode);
      response.end(JSON.stringify(messages.messages));
    }
   }

  if (request.method === 'POST') {
    statusCode = 201;
    // console.log('REQUEST ----------------');
    request.on('data', (chunk) => {
      messages.messages.results.push(JSON.parse(chunk));
    });
    // console.log(request);
    // console.log('POST');
    var pathname = url.parse(request.url).pathname;
    // console.log("Request for " + pathname + " received.");
    response.writeHead(statusCode, headers);

    // messages.results.push(JSON.parse(request._postData));
    // console.log('THIS WENT IN', messages.results);
    response.end();

  }

  // response.write('test');

//   request.on('response', function (response) {
//   var body = '';
//   response.on('data', function (chunk) {
//     body += chunk;
//   });
//   response.on('end', function () {
//     console.log('BODY: ' + body);
//   });
// });
// request.end();


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
// stringified messages

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;

