import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Header from '@/components/common/header';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConfirmationModal from '@/components/common/confirmationModal';
import { Container, ThemeProvider, Typography } from '@mui/material';
import { theme } from '..';
import ApplicationDocumentsGrid from '@/components/application/applicationDocumentGrid';
import ApplicationForm from '@/components/application/applicationForm';

const ApplIdLink = ({ applId }) => <Link style={{ textDecoration: 'underline', color: 'blue' }} href={`/dashboard/application/get/${applId}`}>{applId}</Link>;

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Application ID',
    sortable: true,
    width: 150,
    renderCell: (data) => <ApplIdLink applId={data.id} />,
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
  
  const [successMsgOpen, setSuccessMsgOpen] = React.useState(false);
  const handleSuccessMsgOpen = () => setSuccessMsgOpen(true);
  const handleSuccessMsgClose = () => setSuccessMsgOpen(false);
  
  const [deleteMsgOpen, setDeleteMsgOpen] = React.useState(false);
  const handleDeleteMsgOpen = () => setDeleteMsgOpen(true);
  const handleDeleteMsgClose = () => setDeleteMsgOpen(false);

  React.useEffect(refreshDataGrid, [paginationModel.page, paginationModel.pageSize]);

  function refreshDataGrid() {
    async function fetchApplicationData() {
      try {
        const response = await fetch(`http://localhost:8081/api/v1/application/all?size=${paginationModel.page}&limit=${paginationModel.pageSize}`);
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
    handleDeleteMsgOpen();
  }

  function withdrawSelectedApplications() {
    handleDeleteMsgOpen();
  }

  function confirmDeleteApplications() {
    for (const applId of rowSelectionModel) {
      fetch(`http://localhost:8081/api/v1/application/delete/${applId}`, { method: 'DELETE' })
      .then(response => { refreshDataGrid(); });
    }
    handleDeleteMsgClose();
    setTimeout(handleSuccessMsgOpen, 300);
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
            // pageSizeOptions={[5, 10, 20, 50]}
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
        
        {/* <ApplicationForm applId={10} /> */}
        
        <ConfirmationModal
          open={deleteMsgOpen}
          handleClose={handleDeleteMsgClose}
          action="Delete" 
          message="Are you sure you want to delete the selected record(s)?"
          okAction={null}
          yesAction={confirmDeleteApplications}
          noAction={handleDeleteMsgClose}
        />
        <ConfirmationModal
          open={successMsgOpen}
          handleClose={handleSuccessMsgClose}
          action="Success" 
          message="Record(s) deleted!"
          okAction={handleSuccessMsgClose}
          yesAction={null}
          noAction={null}
        />
      </Container>
    </ThemeProvider>
  );
}