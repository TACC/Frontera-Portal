import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { LoadingSpinner, FileInputDropZone } from '_common';
import { findSystemOrProjectDisplayName } from 'utils/systems';
import { FileLengthCell } from '../DataFilesListing/DataFilesListingCells';
import DataFilesUploadModalListingTable from './DataFilesUploadModalListing/DataFilesUploadModalListingTable';

import './DataFilesUploadModal.module.scss';

export const DIRECTION_CLASS_MAP = {
  vertical: 'is-vert',
  horizontal: 'is-horz'
};
export const DEFAULT_DIRECTION = 'vertical';
export const DIRECTIONS = ['', ...Object.keys(DIRECTION_CLASS_MAP)];

export const DENSITY_CLASS_MAP = {
  compact: 'is-narrow',
  default: 'is-wide'
};
export const DEFAULT_DENSITY = 'default';
export const DENSITIES = ['', ...Object.keys(DENSITY_CLASS_MAP)];

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

const DataFilesUploadModal = ({ className, density, direction }) => {
  const modifierClasses = [];
  modifierClasses.push(DENSITY_CLASS_MAP[density || DEFAULT_DENSITY]);
  modifierClasses.push(DIRECTION_CLASS_MAP[direction || DEFAULT_DIRECTION]);
  const containerStyleNames = ['container', ...modifierClasses].join(' ');

  const history = useHistory();
  const location = useLocation();
  const reloadCallback = () => {
    history.push(location.pathname);
  };

  const isOpen = useSelector(state => state.files.modals.upload);
  const params = useSelector(state => state.files.params.FilesListing);
  const status = useSelector(state => state.files.operationStatus.upload);
  const systemList = useSelector(state => state.systems.storage.configuration);
  const projectsList = useSelector(state => state.projects.listing.projects);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const dispatch = useDispatch();
  const uploadStart = () => {
    const filteredFiles = uploadedFiles.filter(f => status[f.id] !== 'SUCCESS');
    filteredFiles.length > 0 &&
      dispatch({
        type: 'DATA_FILES_UPLOAD',
        payload: {
          system: params.system,
          path: params.path || '',
          files: filteredFiles,
          reloadCallback
        }
      });
  };

<<<<<<< HEAD
  const showListing =
    uploadedFiles.length > 0 ||
    (density === DEFAULT_DENSITY && direction === DEFAULT_DIRECTION);
  const isCompactView =
    uploadedFiles.length > 0 &&
    !(density === DEFAULT_DENSITY && direction === DEFAULT_DIRECTION);
=======
>>>>>>> origin/master
  const systemDisplayName = findSystemOrProjectDisplayName(
    params.scheme,
    systemList,
    projectsList,
    params.system
  );

  const removeFile = id => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };
  const onClosed = () => {
    setUploadedFiles([]);
    dispatch({ type: 'DATA_FILES_MODAL_CLOSE' });
    dispatch({
      type: 'DATA_FILES_SET_OPERATION_STATUS',
      payload: { operation: 'upload', status: {} }
    });
  };

  const toggle = () => {
    dispatch({
      type: 'DATA_FILES_TOGGLE_MODAL',
      payload: { operation: 'upload', props: {} }
    });
  };

  const selectFiles = acceptedFiles => {
    const newFiles = [];
    acceptedFiles.forEach(file => {
      newFiles.push({ data: file, id: uuidv4() });
    });
    setUploadedFiles(files => [...files, ...newFiles]);
  };

  const onRejectedFiles = rejectedFiles => {
    const newFiles = [];
    rejectedFiles.forEach(file => {
      newFiles.push({ data: file, id: uuidv4() });
    });
    setUploadedFiles(files => [...files, ...newFiles]);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      onClosed={onClosed}
      size="xl"
      className="dataFilesModal"
    >
      <ModalHeader toggle={toggle}>
        Upload Files in {systemDisplayName}/{params.path}
      </ModalHeader>
<<<<<<< HEAD
      <ModalBody styleName={containerStyleNames}>
        <div styleName={isCompactView ? 'compact-view' : ''}>
          <FileInputDropZone
            onSetFiles={selectFiles}
            onRejectedFiles={onRejectedFiles}
            maxSize={524288000}
            maxSizeMessage="Max File Size: 500MB"
          />
        </div>
=======
      <ModalBody>
        <FileInputDropZone
          onSetFiles={selectFiles}
          onRejectedFiles={onRejectedFiles}
          maxSize={524288000}
          maxSizeMessage="Max File Size: 500MB"
        />

>>>>>>> origin/master
        <div hidden={uploadedFiles.length === 0} style={{ marginTop: '10px' }}>
          <span style={{ fontSize: '20px' }}>
            Uploading to {systemDisplayName}/{params.path}
          </span>
        </div>
        <div hidden={!showListing} styleName="dataFilesListing">
          <DataFilesUploadModalListingTable
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button className="data-files-btn" onClick={uploadStart}>
          Upload Selected
        </Button>
      </ModalFooter>
    </Modal>
  );
};

DataFilesUploadModal.propTypes = {
  /** Additional className for the root element */
  className: PropTypes.string,
  /** Selector type */
  /* FAQ: We can support any values, even a component */
  // eslint-disable-next-line react/forbid-prop-types
  /** Layout density */
  density: PropTypes.oneOf(DENSITIES),
  /** Layout direction */
  direction: PropTypes.oneOf(DIRECTIONS)
};
DataFilesUploadModal.defaultProps = {
  className: '',
  density: DEFAULT_DENSITY,
  direction: DEFAULT_DIRECTION
};

export default DataFilesUploadModal;
