import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Stack } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function showMessageBox(props: any, setMessageBox: Function) {
  console.log('showMessageBox');
  setMessageBox(prevState => ({
    ...prevState,
    open: true,
    action: props.action,
    message: props.message,
    okAction: props.okAction,
    yesAction: props.yesAction,
    noAction: props.noAction,
  }));
}

export function closeMessageBox(props, setMessageBox: Function, callbackFn?: Function | undefined) {
  console.log('closeMessageBox');
  closeMessagePrompt(setMessageBox);
  setTimeout(() => {
    showMessageBox({
      action: props.action, 
      message: props.message,
      okAction: () => {
        closeMessagePrompt(setMessageBox);
        if (typeof callbackFn === 'function') {
          callbackFn();
        }
      }
    }, setMessageBox);
  }, 500);
}

export function closeMessagePrompt(setMessageBox: Function) {
  console.log('closeMessagePrompt', setMessageBox);
  setMessageBox(prevState => ({
    ...prevState,
    open: false,
    action: '',
    detail: '',
    okAction: undefined,
    yesAction: undefined,
    noAction: undefined,
  }));
}

export default function ConfirmationModal({ open, handleClose, action, message, okAction, yesAction, noAction }) {

  function customOnCloseHandler(event: object, reason: string) {
    if (reason === 'escapeKeyDown' || reason === 'backdropClick') {
      return;
    }
    handleClose();
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={customOnCloseHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {action}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
            { okAction && (
                <Button variant="contained" onClick={okAction}>
                  OK
                </Button>
              )
            }
            { yesAction && (
                <Button variant="contained" onClick={yesAction}>
                  Yes
                </Button>
              )
            }
            { noAction && (
                <Button variant="contained" onClick={noAction}>
                  No
                </Button>
              )
            }
        </Stack>
        </Box>
      </Modal>
    </div>
  );
}