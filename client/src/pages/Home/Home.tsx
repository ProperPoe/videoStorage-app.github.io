
import React, { PureComponent, ReactNode } from 'react'

interface Props {}
interface State {}

class Home extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
           <>
            <h1 className="text-3xl font-bold underline">Hiiii!</h1>
           </> 
        )
    }
}

export default Home
