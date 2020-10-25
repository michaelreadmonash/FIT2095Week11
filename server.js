const express = require('express');
const path = require('path');
let app = express();
let server = require('http').Server(app);

let io = require('socket.io')(server);

let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/votingsystem")));

let pollObj = {
    question: "Select Your Favourite Component",
    options: [
        { text: "Angular", value: 0, count: 0 },
        { text: "MongoDB", value: 1, count: 0 },
        { text: "Express.js", value: 2, count: 0 },
        { text: "Golang", value: 3, count: 0 },
        { text: "Python", value: 4, count: 0 },
        { text: "C#", value: 5, count: 0 },
        { text: "PhP", value: 6, count: 0 },
        { text: "C++", value: 7, count: 0 },
    ],
};

io.on('connection', socket => {
    console.log('new connection made from client with ID = ' + socket.id);
    io.sockets.emit('pollObjectEvent', { pollObject: pollObj } );

    socket.on('newVoteEvent', data => {
        incrementPoll(data);
        console.log('the user vote for: ', data)
        io.sockets.emit('pollObjectEvent', { pollObject: pollObj } );
    })
})

server.listen(port, () => {
    console.log('listening on port ' + port)
});

function incrementPoll(vote) {
    for ( let i = 0; i < pollObj.options.length; i++ )
    {
        if ( pollObj.options[i].text == vote ) {
            pollObj.options[i].count += 1;
        }
    }
};