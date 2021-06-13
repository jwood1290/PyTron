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

function getSteps() {
  return [
    'Select Token',
    'Edit Balance',
    'Edit Price'
  ];
}

export default function EditAssetModal(props) {
  const [asset_id,setAssetID] = React.useState('');
  const [asset_name,setAssetName] = React.useState('');
  const [asset_ticker,setAssetTicker] = React.useState('');
  const [asset_amount,setAssetAmount] = React.useState(0);
  const [asset_price,setAssetPrice] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [is_add, setAddRemove] = React.useState(true);
  const steps = getSteps();

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
    setActiveStep(0);
    props.closeEditAsset();
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
    var price = event.target.value || 0;
    if (price < 0) {price = 0};
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
                required
                id="asset-ticker"
                label="Token Ticker"
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
            direction="column"
            justify="space-between"
            alignItems="stretch"
          >
            <TextField
              required
              id="asset-amount"
              label="Amount"
              value={asset_amount}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{margin:'10px'}}
              onChange={changeAssetAmount}
            />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Button 
                fullWidth
                variant="outlined"
                onClick={changeToAdd}
                style={{
                  marginRight:'2.5%',
                  marginLeft:'2.5%',
                  width:'45%'
                }}
                color={is_add ? "secondary":"primary"}>
                ADD
              </Button>
              <Button 
                fullWidth
                variant="outlined" 
                style={{
                  marginRight:'2.5%',
                  marginLeft:'2.5%',
                  width:'45%'
                }}
                onClick={changeToRemove}
                color={is_add ? "primary":"secondary"}>
                REMOVE
              </Button>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <TextField
            required
            fullWidth
            id="asset-price"
            label="Price"
            value={asset_price}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{margin:'10px'}}
            onChange={changeAssetPrice}
          />
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
          top:'50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width:is_mobile ? '90%':'50%',
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
                disabled={is_last}
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