import React from 'react';
import Step from '@material-ui/core/Step';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import StepLabel from '@material-ui/core/StepLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';

function dictToQuery(obj) {
  var str = [];
  for (const k in obj) {
    if (obj[k] !== '') {
      str.push(encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]));
    }
  }
  return "&" + str.join("&");
}

function getSteps() {
  return [
    'Select Token',
    'Edit Value',
    'Review'
  ];
}

export default function EditAssetModal(props) {
  const [asset_id,setAssetID] = React.useState('');
  const [asset_name,setAssetName] = React.useState('');
  const [asset_ticker,setAssetTicker] = React.useState('');
  const [asset_amount,setAssetAmount] = React.useState(0);
  const [asset_price,setAssetPrice] = React.useState("0.00");
  const [activeStep, setActiveStep] = React.useState(0);
  const [is_add, setAddRemove] = React.useState(true);
  const steps = getSteps();

  const asset_inputs = {
    'id': asset_name,
    'ticker': asset_ticker,
    'amount': asset_amount*(is_add ? 1.0:-1.0),
    'price': asset_price ? asset_price*1.00:0.00
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCancel = () => {
    setActiveStep(0);
    props.closeEditAsset();
  };

  const handleSubmit = () => {
    // console.dir(asset_inputs);
    const params = dictToQuery(asset_inputs);
    props.updateAsset(params);
    // console.dir(asset_inputs);
    // console.log(params);
    setActiveStep(0);
    props.closeEditAsset();
    props.setLoading(true);
  };

  const changeAssetID = (event) => {
    setAssetID(event.target.value);
    if (event.target.value === 'other') {
      setAssetName('');
      setAssetTicker('');
    } else {
      setAssetName(event.target.value);
    }
  }

  const changeAssetName = (event) => {
    setAssetName(event.target.value);
  }

  const changeAssetTicker = (event) => {
    setAssetTicker(event.target.value);
  }

  const changeAssetAmount = (event) => {
    var amount = event.target.value || 0;
    if (amount < 0) {amount = 0};
    setAssetAmount(amount);
  }

  const changeToAdd = () => {
    setAddRemove(true);
  }

  const changeToRemove = () => {
    setAddRemove(false);
  }

  const changeAssetPrice = (event) => {
    var price = event.target.value || "";
    price = price.replace(/[^0-9.-]+/g,"");
    if ((price*1.0) < 0) {
      price = "0.00";
    }
    setAssetPrice(price);
  }

  const is_mobile = props.is_mobile;
  const editAsset = props.editAsset;
  const closeEditAsset = props.closeEditAsset;
  const classes = props.classes;

  var asset_choices = [];
  for (const token in props.data) {
    if (!(props.skip_names.includes(token))) {
      asset_choices.push(<MenuItem value={token} key={token}>{token}</MenuItem>)
    }
  }
  asset_choices.push(<MenuItem value="other" key="other">Other</MenuItem>)

  const str_ticker = (asset_id === 'other') ? asset_ticker:asset_name.toLowerCase();
  const str_price = "$" + asset_price.toString();

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
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
                {asset_choices}
              </Select>
            </FormControl>
            {asset_id === 'other' ? (
              <TextField
                required
                id="asset-id"
                label="Token Name"
                value={asset_name}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                style={{margin:'10px'}}
                onChange={changeAssetName} 
              />
            ):null}
            {asset_id === 'other' ? (
              <TextField
                id="asset-ticker"
                label="Token Ticker (optional)"
                value={asset_ticker}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                style={{margin:'10px'}}
                onChange={changeAssetTicker}
              />
            ):null}
          </Grid>
        );
      case 1:
        return (
          <Grid
            container
            spacing={3}
          >
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="asset-amount"
                label="Amount"
                value={asset_amount}
                type="number"
                variant="outlined"
                onChange={changeAssetAmount}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SwapVerticalCircleIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                <OutlinedInput
                  label="Price"
                  id="outlined-adornment-amount"
                  value={asset_price}
                  onChange={changeAssetPrice}
                  aria-describedby="price-helper-text"
                  startAdornment={
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  }
                />
                <FormHelperText id="price-helper-text">Leave price at $0.00 for rewards/drops and select "BUY (ADD)"</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={changeToAdd}
                color={is_add ? "secondary":"primary"}>
                BUY (ADD)
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button 
                fullWidth
                size="large"
                variant="outlined"
                onClick={changeToRemove}
                color={is_add ? "primary":"secondary"}>
                SELL (REMOVE)
              </Button>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid
            container
            spacing={1}
            justify="center"
            direction="column"
            alignItems="stretch"
          >
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  disabled
                  fullWidth
                  id="asset-name-disabled"
                  value={asset_inputs.id}
                  variant="outlined"
                  inputProps={{style:{textAlign:'center'}}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" style={{width:'50px'}}>
                        NAME:
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  disabled
                  fullWidth
                  id="asset-ticker-disabled"
                  value={str_ticker}
                  variant="outlined"
                  inputProps={{style:{textAlign:'center'}}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" style={{width:'50px'}}>
                        TICKER:
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  disabled
                  fullWidth
                  id="asset-amount-disabled"
                  value={asset_inputs.amount}
                  variant="outlined"
                  inputProps={{style:{textAlign:'center'}}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" style={{width:'50px'}}>
                        AMOUNT:
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  disabled
                  fullWidth
                  id="asset-price-disabled"
                  value={str_price}
                  variant="outlined"
                  inputProps={{style:{textAlign:'center'}}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" style={{width:'50px'}}>
                        PRICE:
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      default:
        return (
          <Typography style={{marginTop:'10px',marginBottom:'10px',textAlign:'center'}}>
            Whoops, it seems there was an error. Press the "Back" button.
          </Typography>
        );
    }
  }

  const is_last = (activeStep === steps.length - 1);
  return (
    <Modal
      open={editAsset}
      onClose={closeEditAsset}
      aria-labelledby="edit-asset-label"
      aria-describedby="edit-asset-description"
    >
      <div 
        className={classes.modal} 
        style={{
          top: is_mobile ? '20%':'50%',
          left: is_mobile ? '5%':'50%',
          transform: is_mobile ? null:'translate(-50%, -50%)',
          width: is_mobile ? '90%':'50%',
        }}
      >
        {/*<div style={{width:'100%'}}>*/}
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
          style={{width:'100%',height:'100%'}}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
          <Grid
            item xs
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{marginTop:'25px'}}
          >
            <Grid
              item
              xs={6}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                style={{marginRight:'5px'}}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color={is_last ? "secondary":"primary"}
                // disabled={is_last}
                onClick={is_last ? handleSubmit:handleNext}>
                {is_last ? 'Submit':'Next'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
}