import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import FlowDesign from '../Components/Drawer/FlowDesign';
import Overview from '../Components/Overview/Overview'
import DocumentDesign from '../Components/DocumentFlow/DocumentDesign';
import DisplayDesign from '../Components/Display/DisplayDesign'
import Administration from '../Components/Administration/Administration'
import './../assets/material.css'
import { Switch, Route } from 'react-router-dom';


class Content extends Component {

  render() {
    return (
      <Paper style={{ maxWidth: "1150", margin: 'auto', overflow: 'hidden' }}>
        <div className="material">
          <Switch>
            <Route path="/admin" exact component={Administration} />
            <Route path="/Project_Overview" exact component={Overview} />
            <Route path="/Flows_Designing" exact component={FlowDesign} />
            <Route path="/Initiate_Flows" exact component={DocumentDesign} />
            <Route path="/Inbox" exact component={DisplayDesign} />
          </Switch>
        </div>
      </Paper>
    );
  }


}

export default Content;
