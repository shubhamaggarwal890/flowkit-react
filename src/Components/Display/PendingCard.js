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

const PendingCard = (props) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Deadline on {props.deadline}
          </Typography>
          <Typography variant="h6" component="h2">
            {props.title}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Started on {props.date}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Initiated by {props.associate_name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Initiator Email Address {props.associate_email}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Initiated for {props.customer_name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            End-User Email Address {props.customer_email}
          </Typography>
          
        </CardContent>
        <CardActions>
          <Button size="small" onClick={props.clicked}>Get Started</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
export default PendingCard;