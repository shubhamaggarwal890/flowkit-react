import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import Paperbase from './Paperbase';
import axios from 'axios';
import { connect } from 'react-redux';

class Flowkit extends Component {

    constructor(props) {
        super(props);
        this.fetchNotifications();
    }

    async componentDidMount() {
        try {
            setInterval(async () => {
                this.fetchNotifications();
            }, 30000);
        } catch (e) {
            console.log(e);
        }
    }

    state = {
        notifications: []
    }

    fetchNotifications = () => {
        axios.post('/get_notifications', {
            id: this.props.id,
        }).then(response => {
            if (response.data) {
                this.setState({
                    ...this.state,
                    notifications: response.data
                })
            }else{
                this.setState({
                    ...this.state,
                    notifications: []
                })
            }
        }).catch(error => {
            console.log("Error", error);
        })
    }


    getNotifications = () => {
        this.state.notifications.forEach((element, index) => {
            this.props.enqueueSnackbar(element.message, {
                autoHideDuration: 10000,
                key: element.id,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        })
    }

    render() {
        return <Paperbase match={this.props.match
        } getNotifications={this.getNotifications}
            number={this.state.notifications.length} />
    }
}

const mapStateToProps = state => {
    return {
        id: state.associate.id,
    };
}


export default connect(mapStateToProps)(withSnackbar(Flowkit));