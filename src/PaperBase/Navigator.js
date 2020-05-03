import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';
import GestureIcon from '@material-ui/icons/Gesture';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import MailIcon from '@material-ui/icons/Mail';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const { classes, ...other } = props;
  let paper = {...other}
  paper.dispatch = ''
  return (
    <Drawer variant="permanent" {...paper}>
      <List disablePadding>
        <ListItem className={clsx(props.classes.firebase, props.classes.item,
          props.classes.itemCategory)}>
          Flow Kit
          </ListItem>
        <NavLink to="Project_Overview" exact style={{ textDecoration: 'none' }}>
          <ListItem className={clsx(classes.item, classes.itemCategory,
            props.header === 'Project Overview' ? classes.itemActiveItem : null)}>
            <ListItemIcon className={classes.itemIcon}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              Project Overview
            </ListItemText>
          </ListItem>
        </NavLink>
        
        <React.Fragment>
          <ListItem
            className={props.classes.categoryHeader}>
            <ListItemText
              classes={{
                primary: props.classes.categoryHeaderPrimary,
              }}
            >
              Develop
            </ListItemText>
          </ListItem>

          {props.role==="Flow Kit Admin"?
          <NavLink to="/admin" exact style={{ textDecoration: 'none' }}>
            <ListItem button className={clsx(props.classes.item,
              props.header === 'admin' ? classes.itemActiveItem : null)}>
              <ListItemIcon className={props.classes.itemIcon}><DashboardIcon /></ListItemIcon>
              <ListItemText classes={{ primary: props.classes.itemPrimary }}>
                Admin Dashboard
              </ListItemText>
            </ListItem>
          </NavLink>:null}
          
          {props.role==="Flow Kit Designer"?
          <NavLink to="/Flows_Designing" exact style={{ textDecoration: 'none' }}>
            <ListItem button className={clsx(props.classes.item,
              props.header === 'Flows Designing' ? classes.itemActiveItem : null)}>
              <ListItemIcon className={props.classes.itemIcon}><GestureIcon /></ListItemIcon>
              <ListItemText classes={{ primary: props.classes.itemPrimary }}>
                Design Flows
              </ListItemText>
            </ListItem>
          </NavLink>:null}
          {props.role!=="Customer"?
          <NavLink to="/Initiate_Flows" exact style={{ textDecoration: 'none' }}>
            <ListItem button className={clsx(props.classes.item,
              props.header === 'Initiate Flows' ? classes.itemActiveItem : null)}>
              <ListItemIcon className={props.classes.itemIcon}><ArtTrackIcon /></ListItemIcon>
              <ListItemText classes={{ primary: props.classes.itemPrimary }}>
                Initiate Flows
              </ListItemText>
            </ListItem>
          </NavLink>: null}
          <NavLink to="/Inbox" exact style={{ textDecoration: 'none' }}>
            <ListItem button className={clsx(props.classes.item,
              props.header === 'Inbox' ? classes.itemActiveItem : null)}>
              <ListItemIcon className={props.classes.itemIcon}><MailIcon /></ListItemIcon>
              <ListItemText classes={{ primary: props.classes.itemPrimary }}>
                Inbox
              </ListItemText>
            </ListItem>
          </NavLink>
        </React.Fragment>
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    role: state.associate.role,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(Navigator));
