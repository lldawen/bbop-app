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
            Confirm {action}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
            { okAction && (
                <Button variant="contained" color="success" onClick={okAction}>
                  OK
                </Button>
              )
            }
            { yesAction && (
                <Button variant="contained" color="success" onClick={yesAction}>
                  Yes
                </Button>
              )
            }
            { noAction && (
                <Button variant="contained" color="success" onClick={noAction}>
                  no
                </Button>
              )
            }
        </Stack>
        </Box>
      </Modal>
    </div>
  );
}