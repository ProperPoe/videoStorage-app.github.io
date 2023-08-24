
import Navbar from "./components/Navbar"
import "./index.css"
import Home from "./pages/Home/Home"

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

interface Props {}
interface State {}

class App extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      
    }
  }

  render() {
    return (
      <>
      <Navbar />
      <Home /> 
      </>
      
    )
  }
}

// const mapStateToProps = (state) => ({
  
// })

// const mapDispatchToProps = (dispatch) => ({
  
// })

export default (App) /*connect(mapStateToProps, mapDispatchToProps)*/

