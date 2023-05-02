import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowId, GridRowModel, GridRowSelectionModel, GridValueGetterParams } from '@mui/x-data-grid';
import Header from '@/components/common/header';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

const UserIdLink = ({ userId }) => <Link href={`/user/details/${encodeURIComponent(userId)}`}>{userId}</Link>;

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'User ID',
    // description: 'This column has a value getter and is not sortable.',
    sortable: true,
    width: 300,
    renderCell: (data) => <UserIdLink userId={data.id} />,
  },
  {
    field: 'fullName',
    headerName: 'Full Name',
    // width: 400,
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

    const [rows, setRows] = React.useState([]);
    let dataFetched = React.useRef(false);
    const router = useRouter();
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

    React.useEffect(initializeGridData, []);

  function initializeGridData() {
    if (!dataFetched.current) {
      fetch("http://localhost:8081/api/v1/user/all")
      .then(response => response.json())
      .then(response => {
          setRows(setUserDetails(response.data));
      });
      dataFetched.current = true;
    }
  }

  function setUserDetails(userList) {
    let userDataList = [];
    for (let user of userList) {
      userDataList.push({
        id: user.id,
        fullName: user.firstName, //TODO
        role: user.role,
        isActive: user.userDetail && user.userDetail.active ? 'Yes' : 'No',
      });
    }
    return userDataList;
  }

  function goToSignupPage() {
    router.push('/user/signup');
  }

  function deleteSelectedUsers() {
    for (const userId of rowSelectionModel) {
      fetch(`http://localhost:8081/api/v1/user/delete/${userId}`, { method: 'DELETE' })
      .then(response => initializeGridData);
    }
  }

  return (
    <>
      <Header />
      <Box sx={{ width: '90%', margin: '20px auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}  
          disableRowSelectionOnClick
        />
      </Box>
      <Box sx={{ width: '90%', margin: '20px auto' }}>
        <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
          <Button variant="contained" color="success" onClick={goToSignupPage}>
            Add User
          </Button>
          <Button variant="contained" color="error" onClick={deleteSelectedUsers}>
            Delete User
          </Button>
        </Stack>
      </Box>
    </>
  );
}