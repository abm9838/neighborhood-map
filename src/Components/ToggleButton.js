import React, { Component } from 'react'

class ToggleButton extends Component {
  render() {
    return (
      <div>
      {/* hamburger animated icon */}
      <button id="toggle-button" className="toggle-wrapper" onClick={this.props.toggleOpen}>
      <span className="toggle-button">
        <div className="menu-bar bar-top"></div>
        <div className="menu-bar bar-middle"></div>
        <div className="menu-bar bar-bottom"></div>
      </span>
      </button>
      </div>
    )
  }
}

export default ToggleButton
