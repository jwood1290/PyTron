import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import pkg_info from '../package.json';

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.secondary.main,
  },
  endNote: {
    position: 'absolute',
    bottom: '10px',
  },
}));

export default function Login(props) {
  const classes = useStyles();
  const [password, changePass] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [rem_tries, reduceTries] = React.useState(3);

  const handleLogin = (form) => {
    form.preventDefault();
    if (password === process.env.REACT_APP_LOGIN_PASS && rem_tries > 0) {
      setLoading(true);
      props.login();
    } else {
      var n_rem = rem_tries - 1;
      if (n_rem < 0) {n_rem = 0};
      var alert_msg;
      if (n_rem <= 0) {
        alert_msg = 'Incorrect password. You have been locked out.';
      } else {
        alert_msg = 'Incorrect password. ' + n_rem + ' attempts remaining.';
      }
      alert(alert_msg);
      reduceTries(n_rem);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form 
          className={classes.form} 
          noValidate
          onSubmit={e => handleLogin(e)}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => changePass(e.target.value)}
          />
          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || (rem_tries <= 0)}
            >
              Sign In
            </Button>
          </div>
        </form>
        <Backdrop className={classes.backdrop} open={props.failedLogin ? false:loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography variant="body2" color="textSecondary" align="center" className={classes.endNote}>
          {'v' + pkg_info.version + ' ('}
          {new Date().getFullYear()}
          {')'}
        </Typography>
      </div>
    </Container>
  );
}