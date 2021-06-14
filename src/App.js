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
      // currPage: '',
      hasError: false,
      failedLogin: false,
      is_mobile: ((window.innerWidth || window.outerWidth) < 750),
      data: null,
      updateSent: false,
      updateSuccess: false,
      updateMessage: ''
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
    var msg = '';
    if (update.result) {
      msg = 'Forced update successful!';
    } else {
      msg = 'Forced update failed. Try again later.';
    }
    this.setState({
      updateSent: true,
      updateSuccess: update.result,
      updateMessage: msg
    });
  };
  
  updateAsset = async (params) => {
    var asset_url = process.env.REACT_APP_EDIT_ASSET + process.env.REACT_APP_LOGIN_PASS + params;
    const update = await parse_url(asset_url);
    var msg = '';
    if (update.result) {
      msg = 'Asset updated successfully!';
    } else {
      msg = 'Asset failed to update. Try again later.';
    }
    this.setState({
      updateSent: true,
      updateSuccess: update.result,
      updateMessage: msg
    });
  };

  handleClose = (event, reason) => {
    if (reason !== 'clickaway') {
      this.setState({hasError:false});
    }
  };

  handleUpdateClose = (event, reason) => {
    if (reason !== 'clickaway') {
      this.setState({
        updateSent: false
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
      updateAsset:this.updateAsset,
    };

    if (this.state.currPage === '') {
      this.loadDashboard(true);
    }
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
          open={this.state.updateSent} 
          autoHideDuration={6000} 
          onClose={(e,r) => {this.handleUpdateClose(e,r)}}
        >
          <Alert onClose={(e,r) => {this.handleUpdateClose(e,r)}} 
            severity={this.state.updateSuccess ? "success":"error"}>
            {this.state.updateMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }
}

