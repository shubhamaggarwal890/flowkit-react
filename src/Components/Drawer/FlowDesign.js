import React, { Component } from 'react';
import Kitdrawer from './Kitdrawer'
import DrawerButton from './DrawerButton';

class FlowDesign extends Component {

    state = {
        openDrawer: false
    }

    handleClickedButton = () => {
        this.setState({
            openDrawer: true
        })
    }

    render() {
        if(this.state.openDrawer) return <Kitdrawer />
        else return <DrawerButton buttonClick={this.handleClickedButton}/>
    }
}

export default FlowDesign;