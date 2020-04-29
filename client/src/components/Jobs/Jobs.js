import React, { useEffect } from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { LoadingSpinner } from '_common';
import './Jobs.scss';
import * as ROUTES from '../../constants/routes';

function JobsView({ showDetails, showFancyStatus }) {
  const dispatch = useDispatch();
  const spinnerState = useSelector(state => state.spinner);
  const jobs = useSelector(state => state.jobs.list);

  useEffect(() => {
    dispatch({ type: 'GET_JOBS', params: { limit: 100 } });
  }, [dispatch]);

  if (spinnerState) {
    return <LoadingSpinner />;
  }

  const columns = [
    {
      Header: 'Job ID',
      accessor: 'name',
      Cell: el => (
        <span title={el.value} id={`jobID${el.index}`}>
          {el.value}
        </span>
      )
    },
    {
      Header: 'Job Details',
      accessor: 'id',
      show: showDetails,
      Cell: el => (
        <Link
          to={`${ROUTES.WORKBENCH}${ROUTES.HISTORY}/jobs/${el.value}`}
          className="wb-link"
        >
          View Details
        </Link>
      )
    },
    {
      Header: 'Output Location',
      headerStyle: { textAlign: 'left' },
      accessor: '_links.archiveData.href',
      Cell: el => {
        const outputPath = el.value
          .split('/')
          .slice(7)
          .filter(Boolean)
          .join('/');
        return outputPath !== 'listings' ? (
          <Link
            to={`${ROUTES.WORKBENCH}${ROUTES.DATA}/tapis/private/${outputPath}`}
            className="wb-link"
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
      id: 'jobDateCol',
      width: 150
    },
    {
      Header: 'Job Status',
      headerStyle: { textAlign: 'left' },
      accessor: d =>
        d.status.substr(0, 1).toUpperCase() + d.status.substr(1).toLowerCase(),
      Cell: el => {
        const isFailed = el.value === 'Failed';
        const isFinished = el.value === 'Finished';
        if (showFancyStatus && (isFailed || isFinished))
          return (
            <Badge color={isFailed ? 'danger' : 'success'}>{el.value}</Badge>
          );
        return el.value;
      },
      id: 'jobStatusCol',
      width: 100
    }
  ];

  return (
    <ReactTable
      keyField="id"
      data={jobs}
      columns={columns}
      resizable={false}
      resolveData={data => data.map(row => row)}
      pageSize={jobs.length}
      className="jobs-list -striped -highlight"
      defaultSorted={[{ id: 'jobDateCol', desc: true }]}
      noDataText={
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
      }
    />
  );
}

JobsView.propTypes = {
  showDetails: PropTypes.bool,
  showFancyStatus: PropTypes.bool
};
JobsView.defaultProps = {
  showDetails: false,
  showFancyStatus: false
};

export default JobsView;
