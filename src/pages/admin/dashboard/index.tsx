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
import { theme } from '../../';
import CustomLink from '@/components/common/customLink';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Application ID',
    sortable: true,
    width: 150,
    renderCell: (data) => <CustomLink href={`/admin/dashboard/application/${data.id}`} text={data.id} />,
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

export default function AdminApplicationsGrid() {

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
        const response = await fetch(`http://localhost:8081/api/v1/admin/application/all?&size=${paginationModel.page}&limit=${paginationModel.pageSize}`);
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

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ width: '80%', margin: '20px auto' }}>
          <Typography variant='h4'>User Applications</Typography>
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