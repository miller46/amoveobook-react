const express = require('express');
const path = require('path');

const app = express()
app.use('/public', express.static(__dirname + '/public'))

const port = process.env.PORT || 8080;

/* Add headers as webpack dev server runs on port 5000 */
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get('/*', (req,res) => {
	console.log("request received");
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port);

console.log('App is listening on port ' + port);
