import { Component } from '@angular/core';
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  socket: SocketIOClient.Socket;
  selectedOption = String;
  pollObject = {
    question: String,
    options: []
  };

  constructor() {
    this.socket = io.connect();
  }

  ngOnInit() {
    this.listenToEvents();
  }

  listenToEvents() {
    this.socket.on('pollObjectEvent', data => {
      this.pollObject.question = data.pollObject.question;
      this.pollObject.options = data.pollObject.options
   })
  }

  sendVote() {
    this.socket.emit('newVoteEvent', this.selectedOption);
  }
}
