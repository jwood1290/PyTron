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
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import WarningIcon from '@material-ui/icons/Warning';
import UpdateIcon from '@material-ui/icons/Update';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.secondary.main,
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
    overflow: 'inherit',
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
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0
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
  const [editAsset, setAssetModal] = React.useState(false);
  const [editUpdate, setUpdateModal] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [asset_id,setAssetID] = React.useState('');
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

  const toggleSplit = (event) => {
    setSplit(event.target.checked);
  };

  const toggleCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const toggleHistory = (event) => {
    changeToken(event.target.value);
  };

  const toggleAddress = (event) => {
    setTokenAddr(event.target.value);
  };

  const openEditAsset = () => {
    setAssetModal(true);
  };

  const closeEditAsset = () => {
    setAssetModal(false);
  };

  const openUpdate = () => {
    setUpdateModal(true);
  };

  const closeUpdate = () => {
    setUpdateModal(false);
  };

  const forceUpdate = () => {
    props.sendUpdate();
    setUpdateModal(false);
    setLoading(true);
  }

  const changeAssetID = (event) => {
    setAssetID(event.target.value)
  }

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

  var asset_choices = [];
  var token_choices = [<MenuItem value="TRX15" key="TRX">TRX</MenuItem>];
  const skip_names = ['TRX15','last','trx','usd','split_data','breakdown']
  for (const token in props.data) {
    if (!(skip_names.includes(token))) {
      token_choices.push(<MenuItem value={token} key={token}>{token}</MenuItem>)
      asset_choices.push(<MenuItem value={token} key={token}>{token}</MenuItem>)
    }
  }
  asset_choices.push(<MenuItem value="other" key="other">Other</MenuItem>)

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
  if (isLoading) {
    if (props.updatePass || props.updateFail) {
      setLoading(false);
    }
  }
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
            <Grid
              xs={4}
              item
              container
              direction="column"
              justify="space-between"
              alignItems="flex-start"
            >
              <Typography variant="body2" color="primary" align="left">
                {'Updated: ' + last_date}
              </Typography>
              {is_mobile ? null:(<Typography variant="body2" color="primary" align="right">
                {'v' + pkg_info.version}
              </Typography>)}
            </Grid>
            <Grid item xs={4}>
              <Typography component="h1" variant="h5" color="primary" noWrap className={classes.title}>
                <Box fontWeight="fontWeightBold" m={1}>
                  {dash_title}
                </Box>
              </Typography>
            </Grid>
            <Grid
              xs={4}
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <IconButton aria-label="edit-asset" color="secondary" onClick={openEditAsset}>
                <MonetizationOnIcon />
              </IconButton>
              <IconButton aria-label="edit-asset2" color="secondary" onClick={openUpdate}>
                <UpdateIcon />
              </IconButton>
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
        <Modal
          open={editAsset}
          onClose={closeEditAsset}
          aria-labelledby="edit-asset-label"
          aria-describedby="edit-asset-description"
        >
          <div 
            className={classes.modal} 
            style={{
              top:'50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width:is_mobile ? '90%':'50%'
            }}
          >
            <h2 id="edit-asset-label">Asset Editor</h2>
            <p id="edit-asset-description">
              Choose a <b><em>token</em></b> from the list (or enter a new token) and enter the <b><em>amount</em></b> you want to add to the total balance. The <b><em>price</em></b> is optional (defaults to 0, which would be the equivalent of a free drop).
            </p>
            <Grid
              container
              direction="column"
              justify="space-between"
              alignItems="stretch"
            >
              <FormControl variant="outlined" className={classes.selectCenter} style={{margin:'10px'}}>
                <InputLabel id="asset-choices-select-label">Token</InputLabel>
                <Select
                  labelId="asset-choices-select-label"
                  id="asset-choices-select"
                  value={asset_id}
                  onChange={changeAssetID}
                  label="Token"
                  MenuProps={{classes:{paper:classes.menuPaper}}}
                >
                  {token_choices}
                </Select>
              </FormControl>
              <TextField
                required
                id="asset-amount"
                label="Amount"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={0}
                variant="outlined"
                style={{margin:'10px'}}
              />
              <TextField
                required
                id="asset-price"
                label="Price"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={0}
                variant="outlined"
                style={{margin:'10px'}}
              />
            </Grid>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Button variant="contained" disabled style={{margin:'10px'}}>
                Submit
              </Button>
            </Grid>
          </div>
        </Modal>
        <Modal
          open={editUpdate}
          onClose={closeUpdate}
          aria-labelledby="update-label"
          aria-describedby="update-description"
        >
          <div 
            className={classes.modal} 
            style={{
              top:'50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width:is_mobile ? '90%':'50%'
            }}
          >
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="stretch"
            >
              <h2 id="update-label" style={{textAlign:'center'}}>Are you sure you want to force an update?</h2>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<WarningIcon />}
                onClick={forceUpdate}
              >
                Force Update
              </Button>
            </Grid>
          </div>
        </Modal>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </main>):null}
    </div>
  );
}

