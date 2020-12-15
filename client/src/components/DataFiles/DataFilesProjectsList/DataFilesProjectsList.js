import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { InfiniteScrollTable, LoadingSpinner, Message } from '_common';
import './DataFilesProjectsList.module.scss';
import './DataFilesProjectsList.scss';

const DataFilesProjectsList = () => {
  const { error, loading, projects } = useSelector(
    state => state.projects.listing
  );

  const infiniteScrollCallback = useCallback(() => {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'PROJECTS_SHOW_SHARED_WORKSPACES'
    });
  }, [dispatch]);

  const columns = [
    {
      Header: 'Workspace Title',
      headerStyle: { textAlign: 'left' },
      accessor: 'description',
      Cell: el => (
        <Link
          className="data-files-nav-link"
          to={`/workbench/data/tapis/projects/${el.row.original.id}`}
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
          {el.value ? `${el.value.first_name} ${el.value.last_name}` : ''}
        </span>
      )
    },
    {
      Header: 'ID',
      headerStyle: { textAlign: 'left' },
      accessor: 'name',
      Cell: el => <span>{el.value.split('-').slice(-1)[0]}</span>
    }
  ];

  const noDataText = "You don't have any Shared Workspaces.";

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Message type="error">
        There was a problem retrieving your Shared Workspaces
      </Message>
    );
  }

  return (
    <div styleName="root">
      <InfiniteScrollTable
        tableColumns={columns}
        tableData={projects}
        onInfiniteScroll={infiniteScrollCallback}
        isLoading={loading}
        noDataText={noDataText}
        className="projects-listing"
      />
    </div>
  );
};

export default DataFilesProjectsList;
