import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridArrowDownwardIcon, GridColDef, GridDeleteIcon } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import ConfirmationModal, { closeMessagePrompt, showMessageBox } from '../common/confirmationModal';
import { closeMessageBox } from '../common/confirmationModal';
import { getDropdownOptions } from '../common/util';
import { DisabledByDefault } from '@mui/icons-material';

export default function ApplicationDocumentsGrid({ applId }) {

  type Nullable<T> = T | null;
  
  const [applicationDocument, setApplicationDocument] = React.useState({
    id: '',
    applId: applId,
    documentType: '',
    documentTypeDescr: '',
    documentName: '',
    documentPath: '',
    documentFile: null as Nullable<object>,
  });

  const[pageState, setPageState] = React.useState({
    isLoading: false,
    rows: [],
    rowCount: 0,
  });
  // const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 5 });
  
  const [documentTypeList, setDocumentTypeList] = React.useState([]);

  const [messageBox, setMessageBox] = React.useState({
    open: false,
    action: '',
    message: '',
    okAction: undefined as unknown,
    yesAction: undefined as unknown,
    noAction: undefined as unknown,
  });

  React.useEffect(() => {
    refreshDataGrid();
    getDropdownOptions('DOCUMENT_TYPE', setDocumentTypeList);
  }, [paginationModel.page, paginationModel.pageSize]);

  function refreshDataGrid() {
    async function fetchApplicationDocData() {
      try {
        const response = await fetch(`http://localhost:8081/api/v1/application/document/all?applId=${applId}&size=${paginationModel.page}&limit=${paginationModel.pageSize}`);
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

  function saveDocument() {
    showMessageBox({
      action: 'Save', 
      message: 'Do you want to save the uploaded document?',
      yesAction: saveApplicationDetails,
      noAction: () => closeMessagePrompt(setMessageBox),
    }, setMessageBox);
  }

  // function confirmSaveDocument() {
  //   console.log('confirmSaveDocument: ', applicationDocument);
  //   saveApplicationDetails();
  // }

  async function saveApplicationDetails() {
    console.log('saveApplicationDocument: ', applicationDocument);
    const formData = new FormData();
    formData.append('applId', applicationDocument.applId);
    formData.append('documentType', applicationDocument.documentType);
    formData.append('documentName', applicationDocument.documentName);
    formData.append('documentFile', applicationDocument.documentFile);
    const result = await fetch(`http://localhost:8081/api/v1/application/document/create`, {
        method: 'POST',
        body: formData,
        headers: {
            // 'Content-type': 'multipart/form-data',
            // 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    if (result.ok) {
        closeMessageBox({
          action: 'Save', 
          message: 'Document has been saved!',
        }, setMessageBox, refreshComponents);
    }
  }

  function refreshComponents() {
    refreshDataGrid();
    removeUploadedDocument();
  }

  function deleteDocument(documentId) {
    showMessageBox({
      action: 'Confirmation', 
      message: 'Do you want to delete this document?',
      yesAction: () => confirmDeleteDocument(documentId),
      noAction: () => closeMessagePrompt(setMessageBox),
    }, setMessageBox);
  }

  function confirmDeleteDocument(documentId) {
    fetch(`http://localhost:8081/api/v1/application/document/delete/${documentId}`, { method: 'DELETE' })
    .then(response => { refreshDataGrid(); });

    closeMessageBox({
      action: 'Success', 
      message: 'Document has been deleted!',
    }, setMessageBox);
  }

  function removeUploadedDocument() {
    setApplicationDocument(prevState => ({
      ...prevState,
      documentName: '',
      documentFile: null,
    }));
    document.getElementById('documentName').value = '';
    displayUploadLabelMsg();
  }

  function displayUploadLabelMsg() {
    const documentFileName = document.getElementById('documentName').value;
    const removeDocBtn = document.getElementById('removeDocBtn');
    if (documentFileName) {
      document.getElementById('document-label').innerHTML = `<strong>${documentFileName}</strong>`;
      if (removeDocBtn) {
        removeDocBtn.style.display = 'inline-block';
      }
    } else {
      document.getElementById('document-label').innerHTML = 'Please upload your supporting document e.g. ID ...';
      if (removeDocBtn) {
        removeDocBtn.style.display = 'none';
      }
    }
  }

  function setFieldValue(fieldName, newValue) {
    console.log('setFieldValue', fieldName, newValue);
    const documentFileObj = document.getElementById('documentName').files[0];
    const documentFile = documentFileObj && documentFileObj.name ? documentFileObj : null;
    setApplicationDocument(prevState => ({
      ...prevState,
      [fieldName]: newValue,
      documentFile: documentFile,
    }));
    displayUploadLabelMsg();
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      sortable: false,
      width: 100,
      renderHeader: (data) => <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>ID</span>,
      renderCell: (data) => <span style={{ marginLeft: '10px' }}>{data.id}</span>,
    },
    {
      field: 'documentName',
      headerName: 'File Name',
      width: 400,
      editable: false,
      sortable: true,
    },
    {
      field: 'documentTypeDescr',
      headerName: 'Document Type',
      width: 200,
      sortable: true,
      editable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      width: 100,
      editable: false,
      sortable: false,
      align: 'center',
      // renderCell: (data) => <><GridArrowDownwardIcon sx={{ mr: 2, color: '#0063ba' }} onClick={() => downloadDocument(data.row.documentPath)} /><GridDeleteIcon sx={{ color: '#942230' }} onClick={() => deleteDocument(data.id)} /></>,
      renderCell: (data) => (
        <>
          <a 
            target="_blank" rel="noopener noreferrer"
            href={`http://localhost:8081/api/v1/application/document/download/${data.row.documentPath}`}>
              <GridArrowDownwardIcon sx={{ mr: 2, color: '#0063ba' }} />
          </a>
          <a href="javascript:void(0)">
            <GridDeleteIcon sx={{ color: '#942230' }} onClick={() => deleteDocument(data.id)} />
          </a>
        </>
      ),
    },
  ];

  return (
    <>
      <Box id="supportingDocSection" sx={{ width: '100%', margin: '20px auto' }}>
        <Typography component="h1" variant="h6" sx={{ margin: '20px 0 10px' }}>Supporting Documents</Typography>
      </Box>
      
      <Box sx={{ width: '100%', margin: '20px auto' }} >
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
            {documentTypeList.map((option) => (
              <MenuItem key={option.code} value={option.code}>{option.codeDescription}</MenuItem>    
            ))}
            </Select>
          </FormControl>
          <Button sx={{ mt: 1, mr: 1, }} variant="contained" component="label">
            { applicationDocument.documentFile == null ? 'Upload' : 'Replace' }
            <input hidden accept="image/*" multiple type="file"
              id="documentName"
              name="documentName"
              value={applicationDocument.documentName} 
              onChange={(e) => { setFieldValue(e.target.name, e.target.value) }}
            />
          </Button>
          <Button sx={{ mt: 1, mr: 1, }} variant="contained" disabled={applicationDocument.documentFile == null} type='button' onClick={saveDocument}>
            Save
          </Button>
          <Box sx={{ width: '100%', margin: '20px 0' }}>
            <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
              <FormControl sx={{ mb: 5, width: '100%' }} size="small">
                <InputLabel id="document-label">
                  Please upload your supporting document e.g. ID ...
                </InputLabel>
              </FormControl>
              {applicationDocument.documentName != '' && (
                <DisabledByDefault id="removeDocBtn" onClick={removeUploadedDocument} sx={{ margin: '20px 0', color: '#942230' }} />    
              )}
            </Stack>
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
          // checkboxSelection
          // rowSelectionModel={rowSelectionModel}
          // onRowSelectionModelChange={(newRowSelectionModel) => { setRowSelectionModel(newRowSelectionModel); }}
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
    </>
  );
}