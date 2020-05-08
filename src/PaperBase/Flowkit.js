import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import Paperbase from './Paperbase';

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class Flowkit extends Component {

    constructor(props){        
        super(props);
        console.log("Hello world");
        
    }

    getNotifications = () => {
        for(var index = 0; index<10; index++){
            this.props.enqueueSnackbar("The quick brown fox jumps over the lazy dog", {
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            })
            sleep(3000);
        }
    }



    render(){
        return <Paperbase match={this.props.match} getNotifications={this.getNotifications}/>
    }
}
export default withSnackbar(Flowkit);