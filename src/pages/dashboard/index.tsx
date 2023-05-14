import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Header from '@/components/common/header';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConfirmationModal, { closeMessageBox, closeMessagePrompt, showMessageBox } from '@/components/common/confirmationModal';
import { Container, ThemeProvider, Typography } from '@mui/material';
import { theme } from '..';
import CustomLink from '@/components/common/customLink';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Application ID',
    sortable: true,
    width: 150,
    renderCell: (data) => <CustomLink href={`/dashboard/application/get/${data.id}`} text={data.id} />
  },
  {
    field: 'applTypeDescr',
    headerName: 'Application Type',
    width: 220,
    editable: false,
  },
  {
    field: 'purposeDescr',
    headerName: 'Purpose',
    // type: 'number',
    width: 300,
    editable: false,
  },
  {
    field: 'statusDescr',
    headerName: 'Status',
    // type: 'number',
    width: 130,
    editable: false,
  },
];

export default function ApplicationsGrid() {

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

  function refreshDataGrid() {
    async function fetchApplicationData() {
      try {
        console.log('localStorage, ', localStorage);
        const response = await fetch(`http://localhost:8081/api/v1/application/all?userId=${localStorage.getItem('userId')}&size=${paginationModel.page}&limit=${paginationModel.pageSize}`);
        if (response.ok) {
          const json = await response.json();
          setPageState((prevState) => ({
            ...prevState,
            rows: json.data,
            rowCount: json.others ? json.others.total : 0,
          }));
        }
      } catch (exception) {
        console.log('exception: ', exception);
      }
    }
    fetchApplicationData();
  }

  function submitNewApplication() {
    router.push('/dashboard/application/create');
  }

  function deleteSelectedApplications() {
    showMessageBox({
      action: 'Confirmation', 
      message: 'Do you want to delete the selected application?',
      yesAction: confirmDeleteApplications,
      noAction: () => closeMessagePrompt(setMessageBox),
    }, setMessageBox);
  }

  function confirmDeleteApplications() {
    for (const applId of rowSelectionModel) {
      fetch(`http://localhost:8081/api/v1/application/delete/${applId}`, { method: 'PUT' })
      .then(response => { refreshDataGrid(); });
    }
    closeMessageBox({
      action: 'Success', 
      message: 'The selected application has been successfully deleted!',
    }, setMessageBox);
  }

  function withdrawSelectedApplications() {
    showMessageBox({
      action: 'Confirmation', 
      message: 'Do you want to withdraw the selected application?',
      yesAction: confirmWithdrawSelectedApplications,
      noAction: () => closeMessagePrompt(setMessageBox),
    }, setMessageBox);
  }

  function confirmWithdrawSelectedApplications() {
    for (const applId of rowSelectionModel) {
      fetch(`http://localhost:8081/api/v1/application/withdraw/${applId}`, { method: 'PUT' })
      .then(response => { refreshDataGrid(); });
    }
    closeMessageBox({
      action: 'Success', 
      message: 'The selected application has been successfully withdrawn!',
    }, setMessageBox);
  }

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ width: '80%', margin: '20px auto' }}>
          <Typography variant='h4'>My Applications</Typography>
        </Box>  
        <Box sx={{ width: '80%', height: 400, margin: '20px auto' }}>
          <DataGrid
          slots={{
            noRowsOverlay: () => <span style={{ margin: '20px 15px'}}>No records to display</span>,
          }}
            columns={columns}
            rows={pageState.rows}
            rowCount={pageState.rowCount}
            loading={pageState.isLoading}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            checkboxSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newRowSelectionModel) => { setRowSelectionModel(newRowSelectionModel); }}
            disableRowSelectionOnClick
          />
        </Box>
        <Box sx={{ width: '80%', margin: '20px auto' }}>
          <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
            <Button variant="contained" onClick={submitNewApplication}>
              New
            </Button>
            <Button variant="contained" disabled={rowSelectionModel.length == 0} onClick={deleteSelectedApplications}>
              Delete
            </Button>
            <Button variant="contained" disabled={rowSelectionModel.length == 0} onClick={withdrawSelectedApplications}>
              Withdraw
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
      </Container>
    </ThemeProvider>
  );
}