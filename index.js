var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

// Define some default values if not set in environment
var PORT = process.env.PORT || 3000;
var SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;
var SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';

// Create a new express app
var app = express();

app.use(bodyParser.json());

// Add CORS headers
app.use(cors());

// Add health check endpoint
app.get(SERVICE_CHECK_HTTP, function (req, res) {
  res.send({ message: 'OK' });
});

var products = [];

app.get('/carts', function (req, res) {
  res.send(carts);

});

app.get('/carts/:sessionid', function (req, res) {
  cart = GetCart(sessionId)
  res.send(cart);
});

app.post('/addProduct', function (req, res) {
	var product = req.body;
	products.push(product);
    res.status(201).location('/carts/' + product.sessionId + '/' + product.Id).end();
});


var getCart = function (sessionId) {
	var products = getProducts(sessionId);
	var totalPrice = calculateTotalPrice(products);
	return {Products : products, TotalPrice : totalPrice, SessionId : sessionId}
  });
  
  
  var calculateTotalPrice(products){
	var sum = 0;
	products.forEach(function(entry){
		sum = sum + entry.Price;
	})
	return sum;
  }
  
 var getProducts= function(sessionId){
	 var result = [];
	 products.forEach(function(entry){
		 if(entry.sessionId === sessionId)
			 result.push(entry)
	 })
	 return result;
 }
// Start the server
var server = app.listen(PORT);

console.log('Service listening on port %s ...', PORT);




////////////// GRACEFUL SHUTDOWN CODE ////

var gracefulShutdown = function () {
  console.log('Received kill signal, shutting down gracefully.');

  // First we try to stop the server smoothly
  server.close(function () {
    console.log('Closed out remaining connections.');
    process.exit();
  });

  // After SHUTDOWN_TIMEOUT we will forcefully kill the process in case it's still running
  setTimeout(function () {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, SHUTDOWN_TIMEOUT);
};

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);
