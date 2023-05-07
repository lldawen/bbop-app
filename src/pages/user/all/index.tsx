import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Header from '@/components/common/header';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConfirmationModal from '@/components/common/confirmationModal';
import { ThemeProvider } from '@mui/material';
import { theme } from '../..';

const UserIdLink = ({ userId }) => <Link href={`/user/get/${encodeURIComponent(userId)}`}>{userId}</Link>;

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'User ID',
    sortable: true,
    width: 320,
    renderCell: (data) => <UserIdLink userId={data.id} />,
  },
  {
    field: 'fullName',
    headerName: 'Full Name',
    width: 350,
    editable: false,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 180,
    editable: false,
  },
  {
    field: 'isActive',
    headerName: 'Is Active?',
    // type: 'number',
    width: 180,
    editable: false,
  },
];

export default function DataGridDemo() {

  const[pageState, setPageState] = React.useState({
    isLoading: false,
    rows: [],
    rowCount: 0,
  });

  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 5 });
  
  const [deleteMsgOpen, setDeleteMsgOpen] = React.useState(false);
  const handleDeleteMsgOpen = () => setDeleteMsgOpen(true);
  const handleDeleteMsgClose = () => setDeleteMsgOpen(false);

  const [successMsgOpen, setSuccessMsgOpen] = React.useState(false);
  const handleSuccessMsgOpen = () => setSuccessMsgOpen(true);
  const handleSuccessMsgClose = () => setSuccessMsgOpen(false);

  React.useEffect(refreshDataGrid, [paginationModel.page, paginationModel.pageSize]);

  function refreshDataGrid() {
    async function fetchUserData() {
      const response = await fetch(`http://localhost:8081/api/v1/user/all?size=${paginationModel.page}&limit=${paginationModel.pageSize}`);
      const json = await response.json();
      setPageState((prevState) => ({
        ...prevState,
        rows: json.data,
        rowCount: json.others.total,
      }));
      console.log('refreshDataGrid: ', pageState);
      console.log('paginationModel: ', paginationModel);
    }
    fetchUserData();
  }

  function goToSignupPage() {
    router.push('/user/create');
  }

  function deleteSelectedUsers() {
    handleDeleteMsgOpen();
  }

  function confirmDeleteUsers() {
    for (const userId of rowSelectionModel) {
      fetch(`http://localhost:8081/api/v1/user/delete/${userId}`, { method: 'DELETE' })
      .then(response => { refreshDataGrid(); });
    }
    handleDeleteMsgClose();
    handleSuccessMsgOpen();
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
          pageSizeOptions={[5, 10, 20, 50]}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          checkboxSelection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) => { setRowSelectionModel(newRowSelectionModel); }}
          disableRowSelectionOnClick
        />
      </Box>
      <Box sx={{ width: '90%', margin: '20px auto' }}>
        <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
          <Button variant="contained" onClick={goToSignupPage}>
            Add User
          </Button>
          <Button variant="contained" color="error" disabled={rowSelectionModel.length == 0} onClick={deleteSelectedUsers}>
            Delete User
          </Button>
        </Stack>
      </Box>
      <ConfirmationModal
        open={deleteMsgOpen}
        handleClose={handleDeleteMsgClose}
        action="Delete" 
        message="Are you sure you want to delete the selected record(s)?"
        okAction={null}
        yesAction={confirmDeleteUsers}
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
    </ThemeProvider>
  );
}