import React, { Component } from 'react'
import { GoogleApiWrapper, Map, InfoWindow } from 'google-maps-react'
import LoadingNoDisplay from './LoadingNoDisplay'

const FOURSQUARECLIENT = 'LWJSQMJCR3RH1IK41JSGK4014KVYLKOBNTOHTU4CYJFK2CZJ'
const FOURSQUARESECRETID = 'IBQ1UXGQZQENZUZD22KRJ00LK3GSHXU52JOTTJWI54DMML43'
const FOURSQUAREVERSION = '20181114'

class MapView extends Component {
  state = {
    map: null,
    markers: [],
    markerProps: [],
    currentMarker: null,
    currentMarkerProps: null,
    showingInfoWindow: false
  }

  componentDidMount = () => {
   console.log(this.props.locations)
  }

  componentWillReceiveProps = (props) => {
    if (this.state.markers.length !== props.locations.length) {
      this.onClose();
      this.setMarkers(props.locations);
      this.setState({currentMarker: null});
      return;
    }
    // if item is not the same, close the info window
    if (!props.indexKey || (this.state.currentMarker &&
      (this.state.markers[props.indexKey] !== this.state.currentMarker))) {
        this.onClose();
      }
    // make sure, if there's an indexKey
    if (props.indexKey === null || typeof(props.indexKey) === "undefined") {
      return;
    };
    // if theres an indexKeys matching, call onMarkerClick to open InfoWindow
    this.onMarkerClick(this.state.markerProps[props.indexKey], this.state.markers[props.indexKey]);
   }

  // markers for location
  mapLoaded = (props, map) => {
    this.setState({map})
    this.setMarkers(this.props.locations)

  }

  getVenueInfo = (props, data) => {
    // compare FS data to markers
    return data.response.venues.filter(item =>
      item.name.includes(props.name) || props.name.includes(item.name));
  }
  // sets states for InfoWindow
  onMarkerClick = (props, marker, e) => {
    // opens markers and closes when new markers are opened
    this.onClose();
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARECLIENT}&client_secret=${FOURSQUARESECRETID}&v=${FOURSQUAREVERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`
    let headers = new Headers();
		let request = new Request(url, {
			method: 'GET',
			headers
    });
      let currentMarkerProps
      fetch(request).then(response => response.json()).then(result => {
        // compare data to locations.name in json and pass into shops
        let shops = this.getVenueInfo(props, result);
        currentMarkerProps = {
          ...props,
          foursquare: shops[0]
        };
        // setting state for data and get images for each shop
        if (currentMarkerProps.foursquare) {
          let url = `https://api.foursquare.com/v2/venues/${shops[0].id}/photos?client_id=${FOURSQUARECLIENT}&client_secret=${FOURSQUARESECRETID}&v=${FOURSQUAREVERSION}`
          fetch(url).then(response => response.json()).then(result => {
            currentMarkerProps = {
              ...currentMarkerProps,
              // add new property 'images' with photo
              images: result.response.photos
            };
            // set states with new currentMarkerProps
            if (this.state.currentMarker)
              this.state.currentMarker.setAnimation(null);
              marker.setAnimation(this.props.google.maps.Animation.DROP);
              this.setState({
                currentMarker: marker,
                showingInfoWindow: true,
                currentMarkerProps });
          })
        } else {
          marker.setAnimation(this.props.google.maps.Animation.DROP)
          this.setState({
            currentMarker: marker,
            showingInfoWindow: true,
            currentMarkerProps
          });
        }
      }).catch(err => {
        // handle API fetch errors
        alert('API not retrieved, check your API key')
      })
  }


  // resets InfoWindow
  onClose = props => {
    // closes active marker and stops animations
    if (this.state.showingInfoWindow) {
     this.state.currentMarker.setAnimation(null);
      this.setState({
        showingInfoWindow: false,
        currentMarkerProps: null,
        currentMarker: null,
      })
    }
  }

 setMarkers = (locations) => {
    if (!locations)
    return;
    // removes any existing markers on load
    this.state.markers.forEach(marker => marker.setMap(null));

    let markerProps = [];
    // create new markers iterating through locations (json) object
    let markers = locations.map((location, i) => {
      let mProps = {
        key: i, i,
        name: location.name,
        position: location.location
      };
      // add new props to markerProps
      markerProps.push(mProps);

      let marker = new this.props.google.maps.Marker({
        position: location.location,
        map: this.state.map,
        animation: this.props.google.maps.Animation.DROP
      });
      // call onMarkerClick for new markers
      marker.addListener('click', () => {
        this.onMarkerClick(mProps, marker, null)
      });
      return marker;
    })
    this.setState({
      markers,
      markerProps
    })
  }

  render() {
    const center = {
      lat: this.props.lat,
      lng: this.props.lng
    }

    const styles = {
      width: '100%',
      height: '100%'
    }
    let cmProps = this.state.currentMarkerProps;
    //console.log(cmProps)
    return (
      <Map
        google={this.props.google}
        onReady={this.mapLoaded}
        aria-label='map'
        zoom={this.props.zoom}
        style={styles}
        initialCenter={center}
      >
        <InfoWindow
        marker={this.state.currentMarker}
        visible={this.state.showingInfoWindow}
        onClose={this.onClose}
        >
          <div>
            {/* compare data from json to FS and use json as fallback */}
            <h4>{cmProps && cmProps.name}</h4>
            {cmProps && cmProps.url ? (<a href={cmProps.url}>site</a>) : '' 
              
          }
            {cmProps && cmProps.images ? (<div>
              <img
                alt={cmProps.name + " food picture"}
                src={cmProps.images.items[0].prefix + "100x100" + cmProps.images.items[0].suffix}/>
                <p>Image from Foursquare</p>
              </div>) : ""}
          </div>
        </InfoWindow>
      </Map>
    );
  }
}
// custom loading and error handling
export default GoogleApiWrapper({
  apiKey: 'AIzaSyD8OV6xpTLOy8qYJE6zewes0oVBL3feJOs',
  LoadingContainer: LoadingNoDisplay
})(MapView)
