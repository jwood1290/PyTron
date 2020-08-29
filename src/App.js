import React, { Component } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Dashboard from './Dashboard.js';
import Login from './Login.js';
import GetHistory from './Database.js';
import { demo_data } from './data/demo_data.js';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currPage: 'login',
      is_mobile: ((window.innerWidth || window.outerWidth) < 750),
      data: demo_data
    }
  }

  loadDashboard = async () => {
    const data = await GetHistory();
    this.setState({
      currPage: 'dashboard',
      data: data,
    });
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
    const appProps = {...this.state,login: this.loadDashboard};
    const page = getPage(appProps);

    return (
      <ThemeProvider theme={darkTheme}>
        {page}
      </ThemeProvider>
    );
  }
}

