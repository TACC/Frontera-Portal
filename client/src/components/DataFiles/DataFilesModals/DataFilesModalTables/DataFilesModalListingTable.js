import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import DataFilesTable from '../../DataFilesTable/DataFilesTable';
import { FileIconCell } from '../../DataFilesListing/DataFilesListingCells';

const DataFilesModalListingNameCell = ({
  api,
  scheme,
  system,
  path,
  name,
  format
}) => {
  const dispatch = useDispatch();
  const onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'FETCH_FILES',
      payload: { api, scheme, system, path, section: 'modal' }
    });
  };

  if (format === 'folder') {
    return (
      <span className="data-files-name">
        <a href="" onClick={onClick} className="data-files-nav-link">
          {' '}
          {name}{' '}
        </a>
      </span>
    );
  }
  return <span className="data-files-name">{name}</span>;
};
DataFilesModalListingNameCell.propTypes = {
  api: PropTypes.string.isRequired,
  scheme: PropTypes.string.isRequired,
  system: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired
};

const DataFilesModalButtonCell = ({
  system,
  path,
  format,
  operationName,
  operationCallback,
  operationOnlyForFolders,
  disabled
}) => {
  const onClick = () => operationCallback(system, path);
  const formatSupportsOperation = operationOnlyForFolders
    ? format === 'folder'
    : true;
  return (
    formatSupportsOperation && (
      <span>
        <Button
          disabled={disabled}
          className="float-right data-files-btn"
          onClick={onClick}
        >
          {operationName}
        </Button>
      </span>
    )
  );
};
DataFilesModalButtonCell.propTypes = {
  system: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  operationName: PropTypes.string.isRequired,
  operationCallback: PropTypes.func.isRequired,
  operationOnlyForFolders: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired
};

const DataFilesModalListingTable = ({
  data,
  operationName,
  operationCallback,
  operationOnlyForFolders,
  disabled
}) => {
  const dispatch = useDispatch();
  const params = useSelector(state => state.files.params.modal, shallowEqual);

  const NameCell = useCallback(
    ({
      row: {
        original: { name, format, path }
      }
    }) => (
      <DataFilesModalListingNameCell
        api={params.api}
        scheme={params.scheme}
        system={params.system}
        path={path}
        name={name}
        format={format}
      />
    ),
    [params]
  );

  const ButtonCell = useCallback(
    ({
      row: {
        original: { system, path, format }
      }
    }) => (
      <DataFilesModalButtonCell
        api={params.api}
        scheme={params.scheme}
        system={system}
        path={path}
        format={format}
        operationName={operationName}
        operationCallback={operationCallback}
        operationOnlyForFolders={operationOnlyForFolders}
        disabled={disabled}
      />
    ),
    [params, operationName, operationCallback, disabled]
  );

  const columns = useMemo(
    () => [
      {
        id: 'icon',
        accessor: 'format',
        width: 0.05,
        minWidth: 20,
        maxWidth: 30,
        Cell: FileIconCell
      },
      {
        Header: 'Name',
        accessor: 'name',
        width: 0.65,
        Cell: NameCell
      },
      {
        Header: '',
        id: 'button',
        width: 0.3,
        Cell: ButtonCell
      }
    ],
    [data]
  );

  const rowSelectCallback = () => {};
  const scrollBottomCallback = useCallback(() => {
    dispatch({
      type: 'SCROLL_FILES',
      payload: {
        ...params,
        section: 'modal',
        offset: data.length
      }
    });
  }, [dispatch, data.length]);
  return (
    <DataFilesTable
      data={data}
      columns={columns}
      rowSelectCallback={rowSelectCallback}
      scrollBottomCallback={scrollBottomCallback}
      section="modal"
    />
  );
};
DataFilesModalListingTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  operationName: PropTypes.string.isRequired,
  operationCallback: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  operationOnlyForFolders: PropTypes.bool
};

DataFilesModalListingTable.defaultProps = {
  disabled: false,
  operationOnlyForFolders: false
};

export default DataFilesModalListingTable;
