// Import modules and exports
const express = require('express');
const logger = require("morgan");
const errorhandler = require("errorhandler");
const bodyParser = require("body-parser");
const path = require('path');
const db = require('./db');
const routes = require('./routes');

// Use express app and router
const app = express();
const router = express.Router();

// Setup middleware
app.use('/', router);
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json({
    extended: false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(errorhandler());

// Routes
app.get('/', function(req, res) {
    res.status(200).sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/posts', routes.posts.getPosts);
app.post('/posts', routes.posts.addPost);
app.put('/posts/:postId', routes.posts.updatePost);
app.delete('/posts/:postId', routes.posts.removePost);

app.get('/posts/:postId/comments', routes.comments.getComments);
app.post('/posts/:postId/comments', routes.comments.addComment);
app.put('/posts/:postId/comments/:commentId', routes.comments.updateComment);
app.delete('/posts/:postId/comments/:commentId', routes.comments.removeComment);

// Start the server
var port = 4000;
var server = app.listen(port, () => console.log("Labb2-sql listening on " + port));

// Shutdown on crash/error
// process.on('uncaughtException', function (error) {
//     console.log(error.stack);
//     process.stdout.write('\x1b[31m'+'\nuncaughtException recieved, shutting down...'+'\x1b[0m');
//     process.stdout.write('\x1b[33m'+'Closing MySQL connection to db... '+'\x1b[0m');
//     db.end();
//     process.stdout.write('\x1b[32m'+'Done!\n'+'\x1b[0m');
//     server.close();
//     console.log('Shutdown complete.');
// });


// Server shutdown, called by entering Ctrl+C
process.on('SIGINT', function() {
    process.stdout.write('\x1b[34m'+'\nSIGINT received, shutting down...');
    process.stdout.write('\x1b[33m'+'\nClosing MySQL connection to db... ');
    db.end();
    process.stdout.write('\x1b[32m'+'Done!\n'+'\x1b[0m');
    server.close();
    console.log('Shutdown complete.');
});