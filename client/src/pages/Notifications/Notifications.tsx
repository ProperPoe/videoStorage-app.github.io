import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

interface Props {}
interface State {}

class Notifs extends PureComponent<Props, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return (
            <h1 className="text-3xl font-bold underline">Nottiii!</h1>
            
        )
    }
}

// const mapStateToProps = (state) => ({
    
// })

// const mapDispatchToProps = (dispatch) => ({
    
// })

export default /*connect(mapStateToProps, mapDispatchToProps)*/(Notifs)
