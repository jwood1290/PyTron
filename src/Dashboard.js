import React from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { AppBar, Toolbar } from '@material-ui/core';
import { Typography, Container } from '@material-ui/core';
import { Grid, Paper } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import pkg_info from '../package.json';
import Line from './SummaryLine.js';
import AddressSummaryChart from './AddressSummaryChart.js';
import TokenSummaryChart from './TokenSummaryChart.js';
import HistoryChart from './HistoryChart.js';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import Switch from '@material-ui/core/Switch';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


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
    // paddingLeft: '39px',
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
  menuPaper: {
    maxHeight: 200,
  },
  midHeight: {
    height: 400,
  },
  limitHeight: {
    maxHeight: 400
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
  select: {
    display: 'flex',
    justifyContent: 'flex-end',
    minWidth: 120,
  },
  selectCenter: {
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
  // const limitHeightPaper = clsx(classes.paper, classes.limitHeight);
  const midHeightTable = clsx(classes.paper, classes.table);
  const [currency,setCurrency] = React.useState('usd');
  const [is_split,setSplit] = React.useState(false);
  const [token_id,changeToken] = React.useState('TRX15');
  const [token_address,setTokenAddr] = React.useState('All');
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

  const toggleAddress = (event) => {
    setTokenAddr(event.target.value);
  };

  const toggleSplit = (event) => {
    setSplit(event.target.checked);
  };

  var show = true;
  var last_date = 'DEMO';
  if (props.data === null) {
    props.login(true);
    show = false;
  } else {
    const is_trx = (currency === 'trx');
    const chartData = props.data.last;
    const dt = new Date(chartData.epoch*1000);
    const year = String(dt.getFullYear()).substring(2,4);
    last_date = String(dt.getMonth() + 1) + "/" + String(dt.getDate()) + "/" + year;

    props = {...props,classes,is_trx,winwidth,chartData,token_id,is_split,token_address};
  }

  var token_choices = [<MenuItem value="TRX15" key="TRX">TRX</MenuItem>];
  const skip_names = ['TRX15','last','trx','usd','split_data','breakdown']
  for (const token in props.data) {
    if (!(skip_names.includes(token))) {
      token_choices.push(<MenuItem value={token} key={token}>{token}</MenuItem>)
    }
  }

  var address_choices = [<MenuItem value="All" key="All">All</MenuItem>];
  props.data.breakdown.forEach(item => {
    var addr = item._id;
    var short_addr = addr.substr(0,3) + '...' + addr.substr(addr.length-3);
    if (addr.length > 10) {
      address_choices.push(<MenuItem value={addr} key={addr}>{short_addr}</MenuItem>)
    } else {
      address_choices.push(<MenuItem value={addr} key={addr}>{addr}</MenuItem>)
    }
  })

  const is_mobile = (winwidth < 500);
  const dash_title = is_mobile ? 'PyTron':'PyTron Dashboard';
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center">
            <Grid item xs>
              <Typography variant="body2" color="primary" align="left">
                {'Updated: ' + last_date}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography component="h1" variant="h5" color="primary" noWrap className={classes.title}>
                <Box fontWeight="fontWeightBold" m={1}>
                  {dash_title}
                </Box>
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="primary" align="right">
                {'v' + pkg_info.version}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {show ? (<main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                    <FormControlLabel value="usd" control={<Radio />} label="USD" />
                    <FormControlLabel value="trx" control={<Radio />} label="TRX" />
                  </RadioGroup>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Switch checked={is_split} onChange={toggleSplit} />}
                      label="Split"
                    />
                  </FormGroup>
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
                <AddressSummaryChart {...props} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={midHeightPaper}>
                <Toolbar disableGutters className={is_mobile ? classes.toolbarNoFlex:null}>
                  <Typography variant="h5" color="primary" gutterBottom className={classes.subTitle}>
                    Token Breakdown
                  </Typography>
                  <FormControl variant="outlined" className={is_mobile ? classes.selectCenter:classes.select}>
                    <InputLabel id="addr-choices-select-label">Address</InputLabel>
                    <Select
                      labelId="addr-choices-select-label"
                      id="addr-choices-select"
                      value={token_address}
                      onChange={toggleAddress}
                      label="Address"
                      MenuProps={{classes:{paper:classes.menuPaper}}}
                    >
                      {address_choices}
                    </Select>
                  </FormControl>
                </Toolbar>
                <TokenSummaryChart {...props} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={midHeightTable}>
                <Toolbar disableGutters className={is_mobile ? classes.toolbarNoFlex:null}>
                  <Typography variant="h5" color="primary" gutterBottom className={classes.subTitle}>
                    Asset History
                  </Typography>
                  <FormControl variant="outlined" className={is_mobile ? classes.selectCenter:classes.select}>
                    <InputLabel id="token-choices-select-label">Token ID</InputLabel>
                    <Select
                      labelId="token-choices-select-label"
                      id="token-choices-select"
                      value={token_id}
                      onChange={toggleHistory}
                      label="Token ID"
                      MenuProps={{classes:{paper:classes.menuPaper}}}
                    >
                      {token_choices}
                    </Select>
                  </FormControl>
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

