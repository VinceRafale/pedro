var express    = require('express'),
    path       = require('path'),
    bodyParser = require('body-parser'),
    http       = require('http'),
    app;

app = express();

app.set('port', process.argv[2] || 3000);
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'www')));

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});