import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { LoadingSpinner } from '_common';
import PropTypes from 'prop-types';
import getOutputPathFromHref from 'utils/jobsUtil';
import { formatDateTime } from 'utils/timeFormat';
import { getStatusText } from '../Jobs/JobsStatus';
import * as ROUTES from '../../constants/routes';
import './JobHistoryModal.module.scss';
import './JobHistoryModal.css';

const placeHolder = '-------------';

function DataFilesLink({ path, displayText }) {
  const text = displayText || path;
  return (
    <Link
      to={`${ROUTES.WORKBENCH}${ROUTES.DATA}/tapis/private/${path}`}
      styleName="link"
    >
      {text}
    </Link>
  );
}

DataFilesLink.propTypes = {
  path: PropTypes.string.isRequired,
  displayText: PropTypes.string
};

DataFilesLink.defaultProps = {
  displayText: null
};

function Entry({ label, children }) {
  return (
    <div styleName="section-entry" key={label}>
      <div styleName="entry-label">{label}</div>
      <div styleName="entry-value">{children}</div>
    </div>
  );
}

Entry.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired
};

function JobHistoryContent({ jobDetails, jobDisplay }) {
  const outputPath = getOutputPathFromHref(jobDetails._links.archiveData.href);
  const created = formatDateTime(new Date(jobDetails.created));
  const lastUpdated = formatDateTime(new Date(jobDetails.lastUpdated));

  return (
    <div styleName="container">
      <div styleName="left-panel">
        <div styleName="panel-content">
          <div styleName="label">Output</div>
          <div>
            {outputPath && (
              <DataFilesLink
                path={outputPath}
                displayText="View in Data Files"
              />
            )}
            {!outputPath && placeHolder}
          </div>
          <Button color="primary">Relaunch Job</Button>
        </div>
      </div>
      <div styleName="right-panel panel-content">
        <div styleName="section">
          <div styleName="label">Status</div>
          <Entry label="Submitted">{created}</Entry>
          <Entry label={getStatusText(jobDetails.status)}>{lastUpdated}</Entry>
        </div>
        <div styleName="section">Failure Report: Todo</div>
        <div styleName="section alternating-background">
          <div styleName="label">Inputs</div>
          {jobDisplay.inputs.map(input => (
            <Entry key={input.id} label={input.label}>
              {input.value}
            </Entry>
          ))}
        </div>
        <div styleName="section alternating-background">
          <div styleName="label">Parameters</div>
          {jobDisplay.parameters.map(param => (
            <Entry key={param.id} label={param.label}>
              {param.value}
            </Entry>
          ))}
        </div>
        <div styleName="section alternating-background">
          Configuration: (Max job runtime, Processors On Each Node, Node count,
          allocation)
        </div>
        <div styleName="section alternating-background">
          Max job runtime: todo
        </div>
        <div styleName="section alternating-background">
          Processors On Each Node: todo
        </div>
        <div styleName="section alternating-background">Node count: todo</div>
        <div styleName="section alternating-background">Allocation: todo</div>
      </div>
    </div>
  );
}

JobHistoryContent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  jobDetails: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  jobDisplay: PropTypes.object.isRequired
};

function JobHistoryModal({ jobId }) {
  const loading = useSelector(state => state.jobDetail.loading);
  // const loadingError = useSelector(state => state.jobDetail.loadingError);
  /*
  const loadingErrorMessage = useSelector(
    state => state.jobDetail.loadingErrorMessage
  );
  */
  const job = useSelector(state => state.jobDetail.job);
  const display = useSelector(state => state.jobDetail.display);

  const jobName = job ? job.name : placeHolder;
  const applicationName = display ? display.applicationName : placeHolder;
  const systemName = display ? display.systemName : placeHolder;

  const history = useHistory();
  const close = () => {
    history.push(`${ROUTES.WORKBENCH}${ROUTES.HISTORY}`);
  };

  return (
    <Modal
      isOpen
      styleName="root"
      className="job-history-modal"
      toggle={close}
      size="lg"
    >
      <ModalHeader styleName="header" toggle={close}>
        <div styleName="header-job" className="d-inline-block text-truncate">
          {jobName}
        </div>
        <div>
          <span
            styleName="header-details"
            className="d-inline-block text-truncate"
          >
            <span styleName="header-details-key">Job ID</span>
            <span styleName="header-details-value">{jobId}</span>
            <span styleName="header-details-key">Application</span>
            <span styleName="header-details-value">{applicationName}</span>
            <span styleName="header-details-key">System</span>
            <span styleName="header-details-value">{systemName}</span>
          </span>
        </div>
      </ModalHeader>

      <ModalBody className="job-history-model--body">
        {loading && <LoadingSpinner />}
        {!loading && (
          <JobHistoryContent jobDetails={job} jobDisplay={display} />
        )}
      </ModalBody>
    </Modal>
  );
}

JobHistoryModal.propTypes = {
  jobId: PropTypes.string.isRequired
};

export default JobHistoryModal;
