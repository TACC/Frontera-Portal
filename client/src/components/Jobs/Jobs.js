import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import 'react-table-6/react-table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { AppIcon, InfiniteScrollTable } from '_common';
import { getOutputPathFromHref } from 'utils/jobsUtil';
import JobsStatus from './JobsStatus';
import './Jobs.scss';
import * as ROUTES from '../../constants/routes';

function JobsView({ showDetails, showFancyStatus, rowProps }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.jobs.loading);
  const jobs = useSelector(state => state.jobs.list);
  const error = useSelector(state => state.jobs.error);
  const limit = 20;
  const noDataText = (
    <>
      No recent jobs. You can submit jobs from the{' '}
      <Link
        to={`${ROUTES.WORKBENCH}${ROUTES.APPLICATIONS}`}
        className="wb-link"
      >
        Applications Page
      </Link>
      .
    </>
  );
  useEffect(() => {
    dispatch({ type: 'GET_JOBS', params: { offset: 0, limit } });
  }, [dispatch]);

  const infiniteScrollCallback = useCallback(offset => {
    // The only way we have some semblance of
    // knowing whether or not there are more jobs
    // is if the number of jobs is not a multiple
    // of the scroll size limit.
    // i.e., you asked for 100 jobs but got 96.
    if (offset % limit === 0) {
      dispatch({ type: 'GET_JOBS', params: { offset, limit } });
    }
  }, []);

  if (error) {
    return (
      <div className="appDetail-error">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          style={{ marginRight: '10px' }}
        />
        <div>We were unable to retrieve your jobs!</div>
      </div>
    );
  }

  const columns = [
    {
      Header: '',
      accessor: 'appId',
      Cell: el => (
        <span>
          <AppIcon appId={el.value} />
        </span>
      )
    },
    {
      Header: 'Job Name',
      accessor: 'name',
      Cell: el => (
        <span
          title={el.value}
          id={`jobID${el.row.index}`}
          className="job__name"
        >
          {el.value}
        </span>
      )
    },
    {
      Header: 'Job Details',
      accessor: 'id',
      show: showDetails,
      Cell: ({ row }) => {
        return (
          <Link
            to={`${ROUTES.WORKBENCH}${ROUTES.HISTORY}/jobs/${row.original.id}?name=${row.original.name}`}
            className="wb-link"
          >
            View Details
          </Link>
        );
      }
    },
    {
      Header: 'Output Location',
      headerStyle: { textAlign: 'left' },
      accessor: '_links.archiveData.href',
      Cell: el => {
        const outputPath = getOutputPathFromHref(el.value);
        return outputPath ? (
          <Link
            to={`${ROUTES.WORKBENCH}${ROUTES.DATA}/tapis/private/${outputPath}`}
            className="wb-link job__path"
          >
            {outputPath}
          </Link>
        ) : null;
      }
    },
    {
      Header: 'Date Submitted',
      headerStyle: { textAlign: 'left' },
      accessor: d => new Date(d.created),
      Cell: el => (
        <span id={`jobDate${el.index}`}>
          {`${el.value.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            timeZone: 'America/Chicago'
          })}
          ${el.value.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Chicago'
          })}`}
        </span>
      ),
      id: 'jobDateCol'
    },
    {
      Header: 'Job Status',
      headerStyle: { textAlign: 'left' },
      accessor: 'status',
      Cell: el => {
        return <JobsStatus status={el.value} fancy={showFancyStatus} />;
      },
      id: 'jobStatusCol'
    }
  ];

  const filterColumns = columns.filter(f => f.show !== false);

  return (
    <InfiniteScrollTable
      tableColumns={filterColumns}
      tableData={jobs}
      onInfiniteScroll={infiniteScrollCallback}
      isLoading={isLoading}
      className={showDetails ? 'jobs-detailed-view' : 'jobs-view'}
      noDataText={noDataText}
      getRowProps={rowProps}
    />
  );
}

JobsView.propTypes = {
  showDetails: PropTypes.bool,
  showFancyStatus: PropTypes.bool,
  rowProps: PropTypes.func
};
JobsView.defaultProps = {
  showDetails: false,
  showFancyStatus: false,
  rowProps: row => {}
};

export default JobsView;
