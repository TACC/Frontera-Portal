import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { LoadingSpinner } from '_common';
import { FileLengthCell } from '../../DataFilesListing/DataFilesListingCells';
import './DataFilesUploadModalListingTable.module.scss';

const DataFilesUploadStatus = ({ i, removeCallback }) => {
  const status = useSelector(state => state.files.operationStatus.upload[i]);
  switch (status) {
    case 'UPLOADING':
      return <LoadingSpinner placement="inline" />;
    case 'SUCCESS':
      return <span className="badge badge-success">SUCCESS</span>;
    case 'ERROR':
      return <span className="badge badge-danger">ERROR</span>;
    default:
      return (
        <button
          type="button"
          className="btn btn-link"
          onClick={() => removeCallback(i)}
        >
          Remove
        </button>
      );
  }
};
DataFilesUploadStatus.propTypes = {
  i: PropTypes.string.isRequired,
  removeCallback: PropTypes.func.isRequired
};

function DataFilesUploadModalListingTable({ uploadedFiles, setUploadedFiles }) {
  const removeFile = id => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  return (
    <div styleName="table-wrapper">
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th aria-label="null" />
          </tr>
        </thead>
        <tbody>
          {uploadedFiles.map((file, i) => (
            <tr key={file.id}>
              <td style={{ verticalAlign: 'middle' }}>{file.data.name}</td>
              <td style={{ verticalAlign: 'middle' }}>
                <FileLengthCell cell={{ value: file.data.size }} />
              </td>
              <td>
                <span className="float-right">
                  <DataFilesUploadStatus
                    i={file.id}
                    removeCallback={removeFile}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

DataFilesUploadModalListingTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  uploadedFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUploadedFiles: PropTypes.func.isRequired
};

export default DataFilesUploadModalListingTable;
