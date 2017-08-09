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
  private selectedStation = 'Abbey Road';
  public noDups = [];
  public Results;
  public displayResults = false;
  public SearchCriteria;
  private stationNodes;
  private pathLen = 5 ;

  constructor() {
    // console.log(this.tubeLines_raw);
    this.toFromList = this.tubeLines_raw.split(':');
    // console.log(this.toFromList);
    var i = 0;
    this.stationNodes = this.toFromList.map(e => {
      const temp = e.split(',');
      return {
        id: i++,
        to: temp[1],
        from: temp[2]
      }
    })
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
    let paths = [];
    paths.push(this.selectedStation);
    while (stops < this.pathLen) {
      stops++;
      console.log(stops, paths);
      let newPaths = [];
      paths.forEach(
        path => {
          console.log(path)
          const stationArray = path.split(':');
          const lastStop = stationArray.pop()
          const results = this.searchPath(lastStop);
          results.forEach(
              station => {
                if (stationArray.indexOf(station) === -1) {
                  let newPath = path + ':' + station;
                  console.log('NewPath ', newPath)
                  newPaths.push(newPath)
                }  else {
                  console.log(station , 'already in path and was not added')
                }
              }
          )
        }
      )
      paths = newPaths;
    }
    // Remove when shorter path exists to station
    let phase2 = paths.map( e => {
      const l = e.split(':');
      return l.pop();
    })
    console.log(phase2)
    // Sort results
    phase2 = phase2.sort()
    // Remove duplicates
    phase2 = phase2.filter((e, index) => {
      const i = phase2.indexOf(e)
      return (index === i)
    })
    // Remove short paths exceptions eg Canning Town
    phase2 = phase2.filter(e => {
      let keepIt = true;
      paths.forEach(
          path => {
            const stationArray = path.split(':');
            const index = stationArray.indexOf(e)
            if (index > -1 && index < this.pathLen) {
              // This result should be removed
              keepIt = false;
              console.log(e , 'has been removed')
            }
          }
      )
      return keepIt;
    })
    this.displayResults = true;
    this.Results = phase2;
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
    this.stationNodes.map(e => {
      if (e.from === station) {
        if (path.indexOf(e.to) === -1) {
          path.push(e.to)
        }
      }
      if (e.to === station) {
        // console.log(path.indexOf(e.from))
        if (path.indexOf(e.from) === -1) {
          path.push(e.from)
        }
        // this.addToPaths()
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

