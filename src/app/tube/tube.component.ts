import { Component, OnInit } from '@angular/core';
import {TubeInfo} from '../tube-info';
@Component({
  selector: 'app-tube',
  templateUrl: './tube.component.html',
  styleUrls: ['./tube.component.css']
})
export class TubeComponent implements OnInit {
  private t = new TubeInfo();
  private tubeLines_raw = this.t.linkList;  // Tube info class holds the raw data
  private toFromList;
  private selectedStation = 'Abbey Road';
  private pathLen = 5 ;
  private noDups = [];  // Holds list of stations
  private stationNodes;
  //
  // These vars are used by html template
  public Results;
  public displayResults = false;
  public SearchCriteria;
  public SearchResults;
  //
  //
  constructor() {
    this.createStationNodesArray();
    this.createStationList();
  }
  //
  createStationNodesArray() {
    // Start by taking the raw station data and building an array
    this.toFromList = this.tubeLines_raw.split(':');
    let i = 0;
    this.stationNodes = this.toFromList.map(e => {
        const temp = e.split(',');
        return {
            id: i++,
            to: temp[1],
            from: temp[2]
        }
    })
  }
  //
  // Create alphabetized list of stations for display
  createStationList() {
  const step1 = this.toFromList.map(e => {
    const temp = e.split(',')[1];
    return temp;
    })

    this.noDups.push(step1[0]);

    step1.filter(e => {
      if (this.noDups.indexOf(e) < 0){this.noDups.push(e)}
      return true;
    })
    // Sort result
    this.noDups.sort();
  }
  //
  // Handle change of station event
  station(eventData) {
    this.selectedStation = eventData.target.value;
  }
  // This does all the heavy lifting
  // It starts with the selected station and the number of stops
  // and builds possible paths
  searchForPaths () {
    this.displayResults = false;
    // this.search(this.selectedStation);
    let stops = 0 ;
    let paths = [];
    paths.push(this.selectedStation);
    while (stops < this.pathLen) {
      stops++;
      console.log(stops, paths);
      const newPaths = [];
      paths.forEach(
        path => {
          console.log(path)
          const stationArray = path.split(':');
          const lastStop = stationArray.pop()
          const results = this.searchPath(lastStop);
          results.forEach(
              station => {
                if (stationArray.indexOf(station) === -1) {
                  const newPath = path + ':' + station;
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
    //
    // We're done calculating all of the possible paths
    // so next we need to clean up the results
    // First step in the clean-up is to remove a path when a when shorter path exists to station
    let phase2 = paths.map( e => {
      const l = e.split(':');
      return l.pop();
    })
    //
    // Next we need to sort the results alphabetically which is a requirement of the spec.
    phase2 = phase2.sort()
    //
    // Next we need to remove duplicates - sometime there are two paths to the same station that meet our requirements
    phase2 = phase2.filter((e, index) => {
      const i = phase2.indexOf(e)
      return (index === i)
    })
    //
    // The last step is to remove a result when a shorter valid path to the station exists
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
    //
    // Now we can display the results
    this.displayResults = true;
    this.Results = phase2;
    this.SearchResults = 'Found ' + phase2.length + ' stations meeting criteria.  Here is the list:'
  }
  //
  // This handles the click event from the search button
  search() {
    this.SearchCriteria = 'Looking for stations ' + this.pathLen + ' stops from ' + this.selectedStation;
    this.searchForPaths();
  }
  //
  // This method finds the stations that are connected to provided station parameter
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
      }
    })
    return path;
  }
  //
  // This handles a change to the input path length
  setPathLen(event) {
    this.pathLen = event.target.value;
  }
  ngOnInit() {
  }
}

