import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function BetterAlert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
}));

export default function Roles(props) {
  const classes = useStyles();
  const [role, setRole] = React.useState("");
  const [message, setMessage] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarError, setSnackbarError] = React.useState(false);


  const roleEntryHandler = () => {
    setMessage(null);
    if (role === null || role.length === 0) {
      setMessage("Role name is required");
      return;
    }
    setMessage(null);
    axios.post('/add_role', {
      name: role,
    }).then(response => {
      if (/Success:/.test(response.data)) {
        setSnackbar(true);
        setRole("");
      }
      else {
        setSnackbarError(true);
        return;
      }
    }).catch(error => {
      setSnackbarError(true);
      return;
    })
  }

  const handleCloseSnackBar = () => {
    setSnackbar(false);
    setSnackbarError(false);
  }


  const roleHandler = (event) => {
    setRole(event.target.value);
    setMessage(null);
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Role based Associate
        </Typography>

        <Grid container spacing={2} style={{ marginTop: "15px" }}>
          <Grid item xs={12}>
            <TextField
              style={{ width: "100%" }}
              variant="outlined"
              required
              fullWidth
              id="role"
              value={role}
              label="Role Name"
              name="role"
              helperText={message}
              onChange={roleHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={roleEntryHandler}
            >
              Add Role
          </Button>
          </Grid>
        </Grid>

        <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleCloseSnackBar}>
          <BetterAlert onClose={handleCloseSnackBar} severity="success">
            Role succesfully entered. Now you'll be able to roles while adding associate.
            </BetterAlert>
        </Snackbar>
        <Snackbar open={snackbarError} autoHideDuration={3000} onClose={handleCloseSnackBar}>
          <BetterAlert onClose={handleCloseSnackBar} severity="error">
            Oh No, You shouldn't have seen this, please try again.
            </BetterAlert>
        </Snackbar>

      </div>
    </Container>
  );
}