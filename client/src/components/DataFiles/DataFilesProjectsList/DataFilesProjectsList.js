import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { InfiniteScrollTable } from '_common';

const DataFilesProjectsList = () => {
  const { error, loading, projects } = useSelector(
    state => state.projects.listing
  );

  const infiniteScrollCallback = useCallback(
    () => {}
  )
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'PROJECTS_GET_LISTING'
    });
  }, [dispatch])

  const columns = [
    {
      Header: 'Workspace Title',
      headerStyle: { textAlign: 'left' },
      accessor: 'description',
      Cell: el => (
        <Link
          className="data-files-nav-link"
          to={`/workbench/data/shared/private/${el.row.original.id}`}
        >
          {el.value}
        </Link>
      )
    },
    {
      Header: 'Owner',
      accessor: 'owner',
      Cell: el => (
        <span>
          {el.value ? el.value : ''}
        </span>        
      )
    },
    {
      Header: 'ID',
      headerStyle: { textAlign: 'left' },
      accessor: 'name',
      Cell: el => (
        <span>
          {el.value.split('-').slice(-1)[0]}
        </span>
      )
    }
  ];

  const noDataText = "You don't have any Shared Workspaces."

  return (
    <InfiniteScrollTable
      tableColumns={columns}
      tableData={projects}
      onInfiniteScroll={infiniteScrollCallback}
      isLoading={loading}
      noDataText={noDataText}
    />
  );
}

export default DataFilesProjectsList;