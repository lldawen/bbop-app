import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';

export default function CertificateMenu({ applId }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();

  function conveyAndCloseApplication() {

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
    </div>
  );
}