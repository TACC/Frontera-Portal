import React from 'react';
import { useHistory, useLocation, NavLink as RRNavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, NavLink } from 'reactstrap';
import { LoadingSpinner, Expand } from '_common';
import PropTypes from 'prop-types';
import { getOutputPathFromHref } from 'utils/jobsUtil';
import { formatDateTime } from 'utils/timeFormat';
import { getStatusText } from '../../Jobs/JobsStatus';

import * as ROUTES from '../../../constants/routes';
import './JobHistoryModal.module.scss';
import './JobHistoryModal.css';

const placeHolder = '...';

function DataFilesLink({ path, displayText, disabled }) {
  const text = displayText || path;
  return (
    <NavLink
      tag={RRNavLink}
      to={`${ROUTES.WORKBENCH}${ROUTES.DATA}/tapis/private/${path}`}
      styleName="link"
      disabled={disabled}
    >
      {text}
    </NavLink>
  );
}

DataFilesLink.propTypes = {
  path: PropTypes.string.isRequired,
  displayText: PropTypes.string,
  disabled: PropTypes.bool
};

DataFilesLink.defaultProps = {
  displayText: null,
  disabled: false
};

function Entry({ label, isTopLevelEntry, children }) {
  return (
    <div styleName="entry-row-container" key={label}>
      <div
        styleName={`entry-label ${
          isTopLevelEntry ? 'top-level-entry' : 'lower-level-entry'
        }`}
      >
        {label}
      </div>
      <div styleName="entry-value">{children}</div>
    </div>
  );
}

Entry.propTypes = {
  label: PropTypes.string.isRequired,
  isTopLevelEntry: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired
};
Entry.defaultProp = {
  isTopLevelEntry: false
};

function JobHistoryContent({ jobDetails, jobDisplay, app }) {
  const outputPath = getOutputPathFromHref(jobDetails._links.archiveData.href);
  const created = formatDateTime(new Date(jobDetails.created));
  const lastUpdated = formatDateTime(new Date(jobDetails.lastUpdated));
  const failureStates = ['FAILED', 'BLOCKED'];
  const isFailed = failureStates.includes(jobDetails.status);
  return (
    <>
      <div styleName="left-panel panel-content">
        <div styleName="label">Output</div>
        <DataFilesLink
          path={outputPath}
          displayText="View in Data Files"
          disabled={outputPath === null}
        />
      </div>
      <div styleName="right-panel panel-content">
        <div styleName="section">
          <div styleName="label">Status</div>
          <Entry label="Submitted">{created}</Entry>
          <Entry label={getStatusText(jobDetails.status)}>{lastUpdated}</Entry>
        </div>
        {isFailed && (
          <Expand
            detail="Failure Report"
            message={jobDetails.lastStatusMessage}
          />
        )}
        <div styleName="section alternating-background">
          <div styleName="label">Inputs</div>
          {jobDisplay.inputs.map(input => (
            <Entry key={input.id} label={input.label}>
              {input.value}
            </Entry>
          ))}
          {jobDisplay.parameters.map(param => (
            <Entry key={param.id} label={param.label}>
              {param.value}
            </Entry>
          ))}
        </div>
        <div styleName="section alternating-background">
          <Entry label="Max Hours" isTopLevelEntry>
            {jobDetails.maxHours}
          </Entry>
        </div>
        {app.parallelism === 'PARALLEL' && (
          <>
            <div styleName="section alternating-background">
              <Entry label="Processors On Each Node" isTopLevelEntry>
                {jobDetails.processorsPerNode}{' '}
              </Entry>
            </div>
            <div styleName="section alternating-background">
              <Entry label="Node Count" isTopLevelEntry>
                {jobDetails.nodeCount}
              </Entry>
            </div>
          </>
        )}
        {'queue' in jobDisplay && (
          <div styleName="section alternating-background">
            <Entry label="Queue" isTopLevelEntry>
              {jobDisplay.queue}
            </Entry>
          </div>
        )}
        {'allocation' in jobDisplay && (
          <div styleName="section alternating-background">
            <Entry label="Allocation" isTopLevelEntry>
              {jobDisplay.allocation}
            </Entry>
          </div>
        )}
      </div>
    </>
  );
}

JobHistoryContent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  jobDetails: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  jobDisplay: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  app: PropTypes.object.isRequired
};

function JobHistoryModal({ jobId }) {
  const loading = useSelector(state => state.jobDetail.loading);
  const loadingError = useSelector(state => state.jobDetail.loadingError);
  const loadingErrorMessage = useSelector(
    state => state.jobDetail.loadingErrorMessage
  );
  const { job, display, app } = useSelector(state => state.jobDetail);
  const { search } = useLocation();

  const applicationName = display ? display.applicationName : placeHolder;
  const systemName = display ? display.systemName : placeHolder;
  let jobName = job ? job.name : placeHolder;

  if (jobName === placeHolder) {
    const jobNameFromQuery = new URLSearchParams(search).get('name');
    if (jobNameFromQuery) {
      jobName = jobNameFromQuery;
    }
  }

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
        <div className="d-inline-block text-truncate">{jobName}</div>
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
        <div styleName="modal-body-container">
          {loading && <LoadingSpinner />}
          {!loading && (
            <JobHistoryContent
              jobDetails={job}
              jobDisplay={display}
              app={app}
            />
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}

JobHistoryModal.propTypes = {
  jobId: PropTypes.string.isRequired
};

export default JobHistoryModal;
