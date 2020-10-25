import { Component } from '@angular/core';
import * as io from "socket.io-client";
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

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
  labelOptions: Array<any> = []
  valueOptions: Array<any> = []

  pieChartOptions: ChartOptions = {
    responsive: true,
  };

  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [0, 0, 0, 0, 0, 0, 0, 0];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];

  constructor() {
    this.socket = io.connect();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.listenToEvents();
  }

  listenToEvents() {
    this.socket.on('pollObjectEvent', data => {

      this.pollObject = data.pollObject;

      this.pieChartData = data.values; 
      this.pieChartLabels = data.labels;
   })
  }

  sendVote() {
    this.socket.emit('newVoteEvent', this.selectedOption);
  }
}