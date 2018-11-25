import React, { Component } from 'react';
import Map from './views/MapView'
import SearchMenu from './views/SearchMenu'
import locations from './data/locations.json'
import './App.css';
import './responsive.css'
class App extends Component {

  //initials 
  state = {
    lat: 	26.2775229,
    lng:  82.0783027,
    zoom: 13.5,
    location: locations,
    open: false,
    filtered: null
  }

  componentDidMount = () => {
    this.setState({
      ...this.state,
      filtered: this.filtering(this.state.location, '')
    });
    // dispay message if failed to load api
    // check your key
    //as
    window.gm_authFailure=()=>{
       alert('GoogleMaps API failed to load, please check API key and reload');
    };
  }

  toggleOpen = () => {
    let toggleButton = document.getElementById('toggle-button').classList
    let menu = document.getElementById('menu-wrap').classList
        toggleButton.toggle('open');
        menu.toggle('menu-open');
    if (document.body.classList.contains('open'))
    this.setState({
      open: !this.state.open
    })

  }
  updateQuery = (query) => {
    this.setState({
      ...this.state,
      indexKey: null,
      filtered: this.filtering(this.state.location, query)
    });
  }
  


  filtering = (locations, query) => {
    return locations.filter(location => location.name.toLowerCase().includes(query.toLowerCase()));
  }
  // passes clicked index and sets state to match markers index to list index
  clickList = (index) => {
    this.setState({
      indexKey: index,
      open: !this.state.open
      })
  }

  render() {
    return (
      <div className="App">
        <div className="App-title">
          <h1>Knitians Favourite Shops</h1>
        </div>
        <section id="SearchMenu">
        <SearchMenu
          locations={this.state.filtered}
          toggleOpen={this.toggleOpen}
          filtering={this.updateQuery}
          clickList={this.clickList}
          open={this.state.open}
          />
        </section>
        <section role='application' id='map'>
        <Map
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
          locations={this.state.filtered}
          indexKey={this.state.indexKey}
          />
        </section>

      </div>
    );
  }
}

export default App;
