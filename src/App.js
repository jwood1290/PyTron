import React, { Component } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Dashboard from './Dashboard.js';
import Login from './Login.js';
import GetHistory from './Database.js';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function parse_url(url) {
  return fetch(url)
  .then(res => res.json())
  .catch(err => console.log('Error parsing URL: ' + err))
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currPage: 'login',
      hasError: false,
      failedLogin: false,
      is_mobile: ((window.innerWidth || window.outerWidth) < 750),
      data: null,
      updatePass: false,
      updateFail: false
    }
  }

  changeState = (k,v) => {
    this.setState({k,v});
  }

  loadDashboard = async (demo=false) => {
    const data = await GetHistory(demo);
    if (data !== null) {
      this.setState({
        currPage: 'dashboard',
        failedLogin: false,
        data: data,
      });
    } else {
      this.setState({
        failedLogin: true,
        hasError:true,
      });
    }
  };

  sendUpdate = async () => {
    const update = await parse_url(process.env.REACT_APP_FORCE_UPDATE);
    if (update.result) {
      this.setState({
        updatePass: true
      });
    } else {
      this.setState({
        updateFail: true
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason !== 'clickaway') {
      this.setState({hasError:false});
    }
  };

  handleUpdateClose = (event, reason) => {
    if (reason !== 'clickaway') {
      this.setState({
        updatePass: false,
        updateFail: false,
      });
    }
  };

  render() {

    const getPage = (props) => {
      switch (props.currPage) {
        default:
          return (<Login {...props} />)
        case 'login':
          return (<Login {...props} />)
        case 'dashboard':
          return (<Dashboard {...props} />)
      }
    };

    const lightGray = '#d1d1d1';
    const orange = '#e8782b';
    const darkTheme = createMuiTheme({
      palette: {
        type: 'dark',
        primary: { main:lightGray },
        secondary: { main:orange },
      }
    });
    const appProps = {...this.state,
      login:this.loadDashboard,
      changeState:this.changeState,
      sendUpdate:this.sendUpdate,
    };
    const page = getPage(appProps);

    return (
      <ThemeProvider theme={darkTheme}>
        {page}
        <Snackbar 
          open={this.state.hasError} 
          autoHideDuration={6000} 
          onClose={(e,r) => {this.handleClose(e,r)}}
        >
          <Alert onClose={(e,r) => {this.handleClose(e,r)}} severity="warning">
            Unable to connect to database. Try again later.
          </Alert>
        </Snackbar>
        <Snackbar 
          anchorOrigin={{vertical:'top',horizontal:'center'}}
          open={this.state.updatePass} 
          autoHideDuration={6000} 
          onClose={(e,r) => {this.handleUpdateClose(e,r)}}
        >
          <Alert onClose={(e,r) => {this.handleUpdateClose(e,r)}} severity="success">
            Forced update successful!
          </Alert>
        </Snackbar>
        <Snackbar 
          anchorOrigin={{vertical:'top',horizontal:'center'}}
          open={this.state.updateFail} 
          autoHideDuration={6000} 
          onClose={(e,r) => {this.handleUpdateClose(e,r)}}
        >
          <Alert onClose={(e,r) => {this.handleUpdateClose(e,r)}} severity="error">
            Forced update failed. Try again later.
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }
}

