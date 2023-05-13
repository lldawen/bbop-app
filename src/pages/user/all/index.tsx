import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Header from '@/components/common/header';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConfirmationModal, { closeMessageBox, closeMessagePrompt, showMessageBox } from '@/components/common/confirmationModal';
import { ThemeProvider } from '@mui/material';
import { theme } from '../..';

export default function UsersGrid() {

  const[pageState, setPageState] = React.useState({
    isLoading: false,
    rows: [],
    rowCount: 0,
  });

  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 5 });
  
  const [messageBox, setMessageBox] = React.useState({
    open: false,
    action: '',
    message: '',
    okAction: undefined as unknown,
    yesAction: undefined as unknown,
    noAction: undefined as unknown,
  });

  React.useEffect(refreshDataGrid, [paginationModel.page, paginationModel.pageSize]);
  
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'User ID',
      sortable: true,
      width: 250,
      renderHeader: (data) => <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>User ID</span>,
      renderCell: (data) => <Link style={{ color: '#942230', marginLeft: '10px', textDecoration: 'underlined', fontWeight: 'bold' }} href={`/user/get/${encodeURIComponent(data.id)}`}>{data.id}</Link>,
    },
    {
      field: 'fullName',
      headerName: 'Full Name',
      width: 330,
      editable: false,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      editable: false,
    },
    {
      field: 'isActive',
      headerName: 'Is Active?',
      // type: 'number',
      width: 120,
      editable: false,
    },
    {
      field: 'Action',
      headerName: 'Action',
      headerAlign: 'center',
      width: 230,
      editable: false,
      align: 'center',
      renderCell: (data) => { console.log(data); return (
        <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
          <Button id="activeToggleBtn" sx={{ fontSize: '.8em' }} variant="outlined" type='button' onClick={() => toggleActiveStatus(data.id, data.row.isActive)}>
              {data.row.isActive == 'Yes' ? 'Deactivate' : 'Activate'}
            </Button>
            <Button id="roleToggleBtn" sx={{ fontSize: '.8em' }} variant="outlined" type='button' onClick={() => toggleRole(data.id, data.row.role)}>
              {data.row.role == 'USER' ? 'Set as Admin' : 'Set as User'}
            </Button>
        </Stack>
      )},
    },
  ];

  function refreshDataGrid() {
    async function fetchUserData() {
      const response = await fetch(`http://localhost:8081/api/v1/user/all?size=${paginationModel.page}&limit=${paginationModel.pageSize}`);
      const json = await response.json();
      setPageState((prevState) => ({
        ...prevState,
        rows: json.data,
        rowCount: json.others.total,
      }));
    }
    fetchUserData();
  }

  function goToSignupPage() {
    router.push('/user/create');
  }

  function toggleActiveStatus(userId, isActive) {
    const action = isActive == 'Yes' ? 'deactivate' : 'activate';
    fetch(`http://localhost:8081/api/v1/user/${action}/${userId}`, { method: 'PUT' })
    .then(response => { 
      closeMessageBox({
        action: 'Success', 
        message: `The selected user has been successfully ${action}d!`,
      }, setMessageBox, refreshDataGrid);
    });
  }

  function toggleRole(userId, role) {
    const isUser = role == 'USER';
    const action = isUser ? 'setAsAdmin' : 'setAsUser';
    fetch(`http://localhost:8081/api/v1/user/${action}/${userId}`, { method: 'PUT' })
    .then(response => { 
      closeMessageBox({
        action: 'Success', 
        message: 'Admin role has been ' + (isUser ? 'added to' : 'removed from') + ' the selected user!',
      }, setMessageBox, refreshDataGrid);
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Box sx={{ width: '90%', margin: '20px auto' }}>
        <DataGrid
          columns={columns}
          rows={pageState.rows}
          rowCount={pageState.rowCount}
          loading={pageState.isLoading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Box>
      <Box sx={{ width: '90%', margin: '20px auto' }}>
        <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
          <Button variant="contained" onClick={goToSignupPage}>
            Add
          </Button>
        </Stack>
      </Box>
      <ConfirmationModal
        open={messageBox.open}
        handleClose={closeMessagePrompt}
        action={messageBox.action}
        message={messageBox.message}
        okAction={messageBox.okAction}
        yesAction={messageBox.yesAction}
        noAction={messageBox.noAction}
      />
    </ThemeProvider>
  );
}