import React, { Component } from 'react'

// using google-maps-react LoadingContainer
class LoadingNoDisplay extends Component {
  state = {
    show: false,
    timeout: null
  }
  // create timeout when component mounts
  componentDidMount = () => {
    let timeout = window.setTimeout(this.errMessage, 120);
    this.setState({timeout})
  }
  // clearing timeout if timeout is still running
  componentWillUnmount = () => {
    window.clearTimeout(this.state.timeout);
  }
  // message that shows when component mounts
  errMessage = () => {
    this.setState({show: true});
  }

  render() {
    return (
      <div>
       {/* if show is true, show network error message, otherwise show map loading */}
        {this.state.show ? (
          <div>
            <h1>Error!, Map didn't load</h1>
            <p>Check your network connection and try again.</p>
          </div>
        ) : (<div><h1>Map is Loading...  Please wait</h1></div>)

      } </div>
    )
  }
}

export default LoadingNoDisplay
