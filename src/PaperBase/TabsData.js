import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { connect } from 'react-redux';

const TabsData = (props) => {
  const changeTabValue = (value) => {
    if (props.header === 'Flows Designing') {
      props.changeTabValueFlows(value);
    } else if (props.header === 'Inbox') {
      props.changeTabValueAssociates(value);
    }
  }

  let tabsHtml = null;
  if (props.header === 'admin') {
    tabsHtml = <AppBar
      component="div"
      className={props.secondaryBar}
      color="primary"
      position="static"
      elevation={0}
    >
      <Tabs value={props.dashboard} textColor="inherit">
        <Tab textColor="inherit" label="SignUp" onClick={props.changeTabValueDashboard.bind(this, 0)} />
        <Tab textColor="inherit" label="Roles" onClick={props.changeTabValueDashboard.bind(this, 1)} />
        <Tab textColor="inherit" label="Individual" onClick={props.changeTabValueDashboard.bind(this, 2)} />
      </Tabs>
    </AppBar>
  }

  else if (props.header === 'Flows Designing') {
    tabsHtml = <AppBar
      component="div"
      className={props.secondaryBar}
      color="primary"
      position="static"
      elevation={0}
    >
      <Tabs value={props.flows_designing_activity} textColor="inherit">
        <Tab textColor="inherit" label="New Design" onClick={changeTabValue.bind(this, 0)} />
        <Tab textColor="inherit" label="Modify Designs" onClick={changeTabValue.bind(this, 1)} />
      </Tabs>
    </AppBar>
  }
  else if (props.header === 'Inbox') {
    tabsHtml = <AppBar
      component="div"
      className={props.secondaryBar}
      color="primary"
      position="static"
      elevation={0}
    >
      <Tabs value={props.associated_flows_activity} textColor="inherit">
        <Tab textColor="inherit" label="Flow Status" onClick={changeTabValue.bind(this, 0)} />
        {
          props.role !== "Customer" ?
            <Tab textColor="inherit" label="Pending Tasks" onClick={changeTabValue.bind(this, 1)} />
            : null
        }
      </Tabs>
    </AppBar>
  }
  return tabsHtml;
}

const mapStateToProps = state => {
  return {
    role: state.associate.role,
    flows_designing_activity: state.flows_designing.activity,
    associated_flows_activity: state.associated_flows.activity,
    dashboard: state.dashboard.activity,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    changeTabValueFlows: (value) => dispatch({ type: 'activity_flows_desiging', value: value }),
    changeTabValueAssociates: (value) => dispatch({ type: 'activity_associated_flows', value: value }),
    changeTabValueDashboard: (value) => dispatch({ type: 'activity_dashboard', value: value }),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TabsData);