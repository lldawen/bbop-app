import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import ConfirmationModal, { closeMessageBox, closeMessagePrompt } from './confirmationModal';

export default function CertificateMenu({ applId }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [messageBox, setMessageBox] = React.useState({
    open: false,
    action: '',
    message: '',
    okAction: undefined as unknown,
    yesAction: undefined as unknown,
    noAction: undefined as unknown,
  });

  const router = useRouter();

  function conveyAndCloseApplication() {
    async function apply() {
      const response = await fetch(`http://localhost:8081/api/v1/admin/application/conveyAndClose/${applId}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            // 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      });
      if (response.ok) {
          closeMessageBox({
              action: 'Success', 
              message: 'Application has been successfully conveyed to the applicant!',
          }, setMessageBox, () => router.push(`/admin/dashboard/`));
      }
    }
    apply();
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        onClick={handleClick}
      >
        Certificate
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
          <a 
            target="_blank" rel="noopener noreferrer"
            href={`http://localhost:8081/api/v1/admin/application/document/download/${applId}`}
          >
            <MenuItem>Download</MenuItem>
          </a>
        <MenuItem onClick={conveyAndCloseApplication}>Convey and Close</MenuItem>
      </Menu>
      <ConfirmationModal
          open={messageBox.open}
          handleClose={() => closeMessagePrompt(setMessageBox)}
          action={messageBox.action}
          message={messageBox.message}
          okAction={messageBox.okAction}
          yesAction={messageBox.yesAction}
          noAction={messageBox.noAction}
      />
    </div>
  );
}