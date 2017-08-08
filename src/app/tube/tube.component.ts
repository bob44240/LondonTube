import { Component, OnInit } from '@angular/core';
import {TubeInfo} from '../tube-info';
@Component({
  selector: 'app-tube',
  templateUrl: './tube.component.html',
  styleUrls: ['./tube.component.css']
})
export class TubeComponent implements OnInit {
  private t = new TubeInfo();
  private tubeLines_raw = this.t.linkList;
  private toFromList;
  private stationList;
  public noDups=[];
  private stationNodes;
  public selectedStation;

  private path=[];
  private paths=[];

  constructor() {
    // console.log(this.tubeLines_raw);
    this.toFromList= this.tubeLines_raw.split(':');
    // console.log(this.toFromList);
    var i = 0;
    this.stationNodes = this.toFromList.map(e => {
      var temp = e.split(',');
      return {
        id: i++,
        to: temp[1],
        from: temp[2]
      }
    })
    // console.log(this.stationNodes)
    const step1 = this.toFromList.map(e => {
      const temp = e.split(',')[1];
      return temp;
      })

    this.noDups.push(step1[0]);

    step1.filter(e => {
      if (this.noDups.indexOf(e)<0){this.noDups.push(e)}
      return true;
    })

    // Sort result
    this.noDups.sort();
    // console.log("DONE",this.noDups);
  }
  //
  station(eventData){
    this.selectedStation = eventData.target.value;
    this.search(this.selectedStation);
  }
  //
  search(station) {
    console.log(station);
    console.log(this.searchPath(station));
  }
  //
  addToPaths() {

  }
  //
  searchPath(station) {
    const path = [];
    console.log('Searching for ', station);
    this.stationNodes.map(e => {
      if (e.from === station) {
        path.push(e.to)
        console.log(e)
      }
      if (e.to === station) {
        console.log(path.indexOf(e.from))
        path.push(e.from)
        this.addToPaths()
        console.log(e)
      }
    })
    return path;
  }

  ngOnInit() {
  }
}

