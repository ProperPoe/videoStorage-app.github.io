
import React, { PureComponent, ReactNode } from 'react'
import PostForm from '../../components/PostForm'
import Posts from '../../components/Posts'
import ViewPost from '../../components/ViewPost'


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
            {/* <h1 className="text-3xl font-bold underline">Hiiii!</h1>
            <PostForm/>
            <Posts/> */}
            <ViewPost/>
           </> 
        )
    }
}

export default Homepage
