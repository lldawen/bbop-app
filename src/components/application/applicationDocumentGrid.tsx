import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider, Typography } from '@mui/material';
import Message from '../common/messageBox';
import MessageBox from '../common/messageBox';
import ConfirmationModal from '../common/confirmationModal';

const ApplDocIdLink = ({ applDocId }) => <Link style={{ textDecoration: 'underline', color: 'blue' }} href={`/dashboard/application/document/get/${applDocId}`}>{applDocId}</Link>;

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Document ID',
    sortable: false,
    width: 150,
  },
  {
    field: 'docTypeDescr',
    headerName: 'Document Type',
    width: 220,
    sortable: true,
    editable: false,
  },
  {
    field: 'documentName',
    headerName: 'File Name',
    width: 300,
    editable: false,
    sortable: true,
    renderCell: (data) => <ApplDocIdLink applDocId={data.id} />,
  },
];

export default function ApplicationDocumentsGrid({ applId }) {

  const [applicationDocument, setApplicationDocument] = React.useState({
    id: '',
    applId: applId,
    documentType: '',
    documentTypeDescr: '',
    documentName: '',
    documentFile: undefined as unknown,
  });

  const[pageState, setPageState] = React.useState({
    isLoading: false,
    rows: [],
    rowCount: 0,
  });
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
    async function fetchApplicationDocData() {
      try {
        const response = await fetch(`http://localhost:8081/api/v1/application/document/all?size=${paginationModel.page}&limit=${paginationModel.pageSize}`);
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
    fetchApplicationDocData();
  }

  function showMessageBox(props: any) {
    console.log('showMessageBox');
    setMessageBox(prevState => ({
      ...prevState,
      open: true,
      action: props.action,
      message: props.message,
      okAction: props.okAction,
      yesAction: props.yesAction,
      noAction: props.noAction,
    }));
  }

  function closeMessageBox(props) {
    console.log('closeMessageBox');
    closeMessagePrompt();
    setTimeout(() => {
      showMessageBox({
        action: props.action, 
        message: props.message,
        okAction: closeMessagePrompt
      });
    }, 500);
  }

  function closeMessagePrompt() {
    console.log('closeMessagePrompt');
    setMessageBox(prevState => ({
      ...prevState,
      open: false,
      action: '',
      detail: '',
      okAction: undefined,
      yesAction: undefined,
      noAction: undefined,
    }));
  }

  function saveDocument() {
    showMessageBox({
      action: 'Save', 
      message: 'Do you want to save document?',
      yesAction: confirmSaveDocument,
      noAction: closeMessagePrompt,
    });
  }

  function confirmSaveDocument() {
    console.log('confirmSaveDocument: ', applicationDocument);
    saveApplicationDetails();
  }

  async function saveApplicationDetails() { 
    const result = await fetch(`http://localhost:8081/api/v1/application/document/create`, {
        method: 'POST',
        body: JSON.stringify(applicationDocument),
        headers: {
            'Content-type': 'application/json',
            // 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    if (result.ok) {
        closeMessageBox({
          action: 'Save', 
          message: 'Document has been saved!',
        });
    }
  }

  function deleteDocument() {
    showMessageBox({
      action: 'Delete', 
      message: 'Do you want to delete the selected document(s)?',
      yesAction: confirmDeleteDocument,
      noAction: closeMessagePrompt,
    });
  }

  function confirmDeleteDocument() {
    for (const applDocId of rowSelectionModel) {
      fetch(`http://localhost:8081/api/v1/application/document/delete/${applDocId}`, { method: 'DELETE' })
      .then(response => { refreshDataGrid(); });
    }
    closeMessageBox({
      action: 'Delete', 
      message: 'Document has been saved!',
    });
  }

  function downloadDocument() {

  }

  function setFieldValue(fieldName, newValue) {
    console.log('setFieldValue: ', fieldName, newValue);
    const documentFile = document.getElementById('documentName').files[0];
    setApplicationDocument(prevState => ({
      ...prevState,
      [fieldName]: newValue,
      documentFile: documentFile,
    }));
  }

  return (
    <>
      <Box sx={{ width: '100%', margin: '20px auto' }}>
        <Typography component="h1" variant="h6" sx={{ margin: '20px 0 10px' }}>Application Documents</Typography>
      </Box>
      
      <Box sx={{ width: '100%', margin: '20px auto' }}>
        <FormControl sx={{ mt: 1, mr: 2, width: 250 }} size="small">
          <InputLabel id="docType-label">Document Type</InputLabel>
          <Select
              labelId="docType-label"
              id="docType-select"
              name="documentType"
              value={applicationDocument.documentType}
              onChange={(e) => { setFieldValue(e.target.name, e.target.value) }}
              label="Document Type"
          >
                {/* {applTypeList.map((option) => ( */}
                  <MenuItem key={1} value={'PASSPORT'}>{'Passport'}</MenuItem>
                  <MenuItem key={2} value={'SSS'}>{'SSS/UMID'}</MenuItem>
                  <MenuItem key={3} value={'DL'}>{'Driver License'}</MenuItem>
              {/* ))}   */}
          </Select>
        </FormControl>
        <Button sx={{ mt: 1, mr: 2, width: 150 }} variant="contained" component="label">
          Upload
          <input hidden accept="image/*" multiple type="file"
            id="documentName"
            name="documentName"
            value={applicationDocument.documentName} 
            onChange={(e) => { setFieldValue(e.target.name, e.target.value) }}
          />
        </Button>
        <Box sx={{ width: '100%', margin: '20px 0' }}>
          <FormControl sx={{ mb: 5, width: '100%' }} size="small">
            <InputLabel id="document-label">{applicationDocument.documentName ? applicationDocument.documentName : 'Please upload a document...'}</InputLabel>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 400, margin: '20px auto' }}>
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
      <Box sx={{ width: '100%', margin: '20px auto' }}>
        <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
          <Button variant="contained" onClick={saveDocument}>
            Save
          </Button>
          <Button variant="contained"  onClick={deleteDocument}>
            Delete
          </Button>
          <Button variant="contained" disabled={rowSelectionModel.length == 0} onClick={downloadDocument}>
            Download
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
    </>
  );
}