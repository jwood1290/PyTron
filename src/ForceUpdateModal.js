import React from 'react';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';

export default function ForceUpdateModal(props) {

  const forceUpdate = () => {
    props.sendUpdate();
    props.setUpdateModal(false);
    props.setLoading(true);
  }

  return (
    <Modal
      open={props.editUpdate}
      onClose={props.closeUpdate}
      aria-labelledby="update-label"
      aria-describedby="update-description"
    >
      <div 
        className={props.classes.modal} 
        style={{
          top:'50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width:props.is_mobile ? '90%':'50%'
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
  );
}