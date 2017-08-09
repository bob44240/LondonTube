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
  private selectedStation;
  public noDups = [];
  public Results;
  public displayResults = false;
  public SearchCriteria;
  private stationNodes;
  private pathLen = 5 ;
  // public selectedStation;
  // public stops = 0;

  // private path = [];
  // private paths = [];

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
  station(eventData) {
    this.selectedStation = eventData.target.value;
  }
  //
  searchForPaths () {
    this.displayResults = false;
    // this.search(this.selectedStation);
    let stops = 0 ;
    let pathCount = 0;
    let paths = [];
    paths.push(this.selectedStation);
    while (stops < this.pathLen) {
      stops++;
      console.log(stops, paths);
      let newPaths = [];
      paths.forEach(
        path => {
          console.log(path)
          let stationArray = path.split(":");
          let lastStop = stationArray.pop()
          let results = this.searchPath(lastStop);
          console.log(results);
          results.forEach(
              station => {
                if (stationArray.indexOf(station) === -1) {
                  let newPath = path + ":" + station;
                  console.log("NewPath ", newPath)
                  newPaths.push(newPath)
                }
                else {
                  console.log(station , "already in path and was not added")
                }
                // Can we add this station to the path?

              }
          )
        }
      )
      paths = newPaths;
      // console.log(paths)
      // console.log(newPaths)
    }
    // Remove short paths - less than N stops
    const phase1 = paths.filter( e => {
      const l = e.split(':');
      return (l.length === this.pathLen + 1)
    })
    console.log(phase1)
    // Remove when shorter path exists to station
    const phase2 = paths.map( e => {
      const l = e.split(':');
      console.log(l)
      return l.pop();
    })
    phase2 = phase2.sort()
    console.log(phase2)
    this.displayResults = true;
    this.Results = paths;
  }
  //
  search() {
    // console.log(this.searchPath(station));
    this.SearchCriteria = 'Looking for stations ' + this.pathLen + ' stops from ' + this.selectedStation;
    this.searchForPaths();
  }
  //
  searchPath(station) {
    const path = [];
    console.log('Searching for ', station);
    this.stationNodes.map(e => {
      if (e.from === station) {
        if (path.indexOf(e.to) === -1)path.push(e.to)
        // console.log(e)
      }
      if (e.to === station) {
        // console.log(path.indexOf(e.from))
        if (path.indexOf(e.from) === -1) {
          path.push(e.from)
        }
        // this.addToPaths()
        // console.log(e)
      }
    })
    return path;
  }

  setPathLen(event) {
    console.log(event)
    this.pathLen = event.target.value;
  }
  ngOnInit() {
  }
}

