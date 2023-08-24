
import React, { PureComponent, ReactNode } from 'react'

interface Props {}
interface State {}

class Homepage extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return (
           <>
            <h1 className="text-3xl font-bold underline">Hiiii!</h1>
           </> 
        )
    }
}

export default Homepage
