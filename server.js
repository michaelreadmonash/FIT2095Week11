const express = require('express');
const path = require('path');

let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/votingsystem")));

//dynamic object -- can change variables/objects without breaking the system
let pollObj = {
    question: "Select Your Favourite Component",
    options: [
        { text: "Angular", count: 0 },
        { text: "MongoDB", count: 0 },
        { text: "Express.js", count: 0 },
        { text: "Golang", count: 0 },
        { text: "Python", count: 0 },
        { text: "C#", count: 0 },
        { text: "PhP", count: 0 },
        { text: "C++", count: 0 },
    ],
};

//when a device is connected run this
io.on('connection', socket => {
    console.log('new connection made from client with ID = ' + socket.id);
    //send this event to all connections
    io.sockets.emit('pollObjectEvent', { pollObject: pollObj, labels: getLabels(), values: getValues() } );

    //when event newVoteEvent is triggered run this
    socket.on('newVoteEvent', data => {
        incrementPoll(data);
        console.log('user ' + socket.id + ' voted for: ', data)
        io.sockets.emit('pollObjectEvent', { pollObject: pollObj, labels: getLabels(), values: getValues() } );
    })
})

//server listening on port 8080
server.listen(port, () => {
    console.log('listening on port ' + port)
});

//matches vote in the object array, if match incremented count by 1
function incrementPoll(vote) {
    for ( let i = 0; i < pollObj.options.length; i++ )
    {
        if ( pollObj.options[i].text == vote ) {
            pollObj.options[i].count += 1;
        }
    }
};

//returns all text options in an array
function getLabels() {
    let labels = [];
    for ( let i = 0; i < pollObj.options.length; i ++ ) {
        labels.push(pollObj.options[i].text);
    }
    //console.log(labels)
    return labels
}

//returns all value options in an array
function getValues() {
    let values = [];
    for ( let i = 0; i < pollObj.options.length; i ++ ) {
        values.push(pollObj.options[i].count);
    }
    //console.log(values)
    return values
}