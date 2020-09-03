import React from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { AppBar, Toolbar } from '@material-ui/core';
import { Typography, Container } from '@material-ui/core';
import { Grid, Paper } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import pkg_info from '../package.json';
import Line from './SummaryLine.js';
import Chart from './SummaryChart.js';
import HistoryChart from './HistoryChart.js';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  toolbarSubIcon: {
    paddingLeft: 6
  },
  toolbarSubIconMobile: {
    paddingLeft: 0
  },
  appBar: {
    background: '#303030',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    textAlign: 'Center',
    fontWeight: 'bold',
    flexGrow: 1,
    paddingLeft: '39px',
  },
  subTitle: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  midHeight: {
    height: 400,
  },
  fullWidth: {
    width: '100%',
  },
  table: {
    maxHeight: 400,
  },
  radio: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  radioCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  toolbarNoFlex: {
    display: 'initial',
    minHeight: 'fit-content',
  }
}));

export default function Dashboard(props) {

  const classes = useStyles();
  const midHeightPaper = clsx(classes.paper, classes.midHeight);
  const midHeightTable = clsx(classes.paper, classes.table);
  const [currency,setCurrency] = React.useState('trx');
  const [token_id,changeToken] = React.useState('TRX15');
  const [winwidth,setWidth] = React.useState(window.innerWidth || window.outerWidth);

  React.useEffect(() => {
    function handleResize() {
      const winWidth = window.innerWidth || window.outerWidth;
      setWidth(winWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const toggleHistory = (event) => {
    changeToken(event.target.value);
  };

  var show = true;
  if (props.data === null) {
    props.login(true);
    show = false;
  } else {
    const is_trx = (currency === 'trx');
    const lineData = is_trx ? props.data.trx:props.data.usd;
    const chartData = props.data.last;
    props = {...props,classes,is_trx,winwidth,lineData,chartData,token_id};
  }

  const is_mobile = (winwidth < 500);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h5" color="primary" noWrap className={classes.title}>
            <Box fontWeight="fontWeightBold" m={1}>
              PyTron Dashboard
            </Box>
          </Typography>
          <Typography variant="body2" color="primary" align="right">
            {'v' + pkg_info.version}
          </Typography>
        </Toolbar>
      </AppBar>
      {show ? (<main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className={midHeightPaper}>
                <Toolbar disableGutters>
                  <Typography variant="h5" color="primary" gutterBottom className={classes.subTitle}>
                    Net Worth History
                  </Typography>
                  <RadioGroup 
                    aria-label="currency" 
                    name="currency1" 
                    value={currency} 
                    onChange={toggleCurrency} 
                    row={!is_mobile}
                    className={classes.radio}
                  >
                    <FormControlLabel value="trx" control={<Radio />} label="TRX" />
                    <FormControlLabel value="usd" control={<Radio />} label="USD" />
                  </RadioGroup>
                </Toolbar>
                <Line {...props}/>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={midHeightPaper}>
                <Toolbar disableGutters>
                  <Typography variant="h5" color="primary" gutterBottom className={classes.subTitle}>
                    Address Breakdown
                  </Typography>
                </Toolbar>
                <Chart {...props} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={midHeightTable}>
                <Toolbar disableGutters className={is_mobile ? classes.toolbarNoFlex:null}>
                  <Typography variant="h5" color="primary" gutterBottom className={classes.subTitle}>
                    Asset History
                  </Typography>
                  <RadioGroup 
                    aria-label="currency" 
                    name="currency1" 
                    value={token_id} 
                    onChange={toggleHistory} 
                    row
                    className={is_mobile ? classes.radioCenter:classes.radio}
                  >
                    <FormControlLabel value="TRX15" control={<Radio />} label="TRX" />
                    <FormControlLabel value="COTI" control={<Radio />} label="COTI" />
                    <FormControlLabel value="FUND" control={<Radio />} label="FUND" />
                  </RadioGroup>
                </Toolbar>
                <HistoryChart {...props} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>):null}
    </div>
  );
}

