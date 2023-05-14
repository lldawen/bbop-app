import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingMask() {
  return (
      <div style={{ zIndex: 2, width: '100%', minHeight: '100%', position: 'absolute', backgroundColor: '#2b2b2b', opacity: 0.5 }}>
        <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', color: '#eeeeee' }} />
      </div>
  );
}