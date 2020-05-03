import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 1,
  },
});

const WorkFlowCard = (props) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h2">
            {props.title}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Designed by {props.creator}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Email Address {props.email}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={props.clicked}>Modify</Button>
          <Button size="small" onClick={props.delete}>Delete</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default WorkFlowCard;
