import React from 'react';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import { makeStyles, CssBaseline, Drawer, AppBar, Toolbar } from '@material-ui/core';
import { List, Typography, Divider, IconButton, Container } from '@material-ui/core';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Grid, Paper } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pkg_info from '../package.json';
import SummaryLine from './SummaryLine.js'
import SummaryChart from './SummaryChart.js'

const lightGray = '#d1d1d1';
// const darkGray = '#3a3e43';
// const darkGray = '#424242';
const orange = '#e8782b';
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
  lowHeight: {
    height: 240,
  },
  midHeight: {
    height: 320,
  }
}));

export default function App() {

  const title_list = {
    history:'Net Worth History',
    cost:'Cost Basis',
  }

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: lightGray
      },
      secondary: {
        main: orange
      },
    }
  });

  // const getPage = (value) => {
  //   switch (value) {
  //     default:
  //       return (<Rewards {...props} />)
  //     case 'rewards':
  //       return (<Rewards {...props} />)
  //     case 'history':
  //       return (<TransactionHistory {...props} />)
  //   }
  // };

  const [open, setOpen] = React.useState(false);
  const [title, changeTitle] = React.useState(title_list['history']);
  // const [dataChoice, changeData] = React.useState(null);
  const [is_mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    function handleResize() {
      const winWidth = window.innerWidth || window.outerWidth;
      setMobile((winWidth < 750));
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handlePageChange = (value) => {
    changeTitle(title_list[value]);
  };


  const classes = useStyles();
  const lowHeightPaper = clsx(classes.paper, classes.lowHeight);
  const midHeightPaper = clsx(classes.paper, classes.midHeight);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h5" color="inherit" noWrap className={classes.title}>
              {title}
            </Typography>
            <Typography variant="body2" color="inherit" align="right">
              {'Pytron Dashboard v' + pkg_info.version}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon color="secondary"/>
            </IconButton>
          </div>
          <Divider />
          <div className={is_mobile ? classes.toolbarSubIconMobile:classes.toolbarSubIcon}>
            <List>
              <ListItem button onClick={() => handlePageChange('history')}>
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary={title_list['history']} />
              </ListItem>
              <ListItem button onClick={() => handlePageChange('cost')}>
                <ListItemIcon><BarChartIcon /></ListItemIcon>
                <ListItemText primary={title_list['cost']} />
              </ListItem>
            </List>
          </div>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={lowHeightPaper}>
                  <SummaryLine {...{isTRX:true}}/>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={midHeightPaper}>
                  <SummaryChart />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={midHeightPaper}>
                  <SummaryLine {...{isTRX:false}}/>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </main>
      </div>
    </ThemeProvider>
  );
}

