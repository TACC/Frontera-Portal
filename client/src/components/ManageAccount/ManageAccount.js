import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Sidebar';
import {
  RequiredInformation,
  ChangePassword,
  Licenses,
  ThirdPartyApps,
  OptionalInformation
} from './ManageAccountTables';
import ManageAccountModals from './ManageAccountModals';
import LoadingSpinner from '../_common/LoadingSpinner';
import './ManageAccount.scss';

const ManageAccountView = () => {
  const { isLoading } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: 'GET_PROFILE_DATA' });
  }, [dispatch, isLoading]);
  return (
    <div className="manage-account-wrapper">
      <Sidebar />
      <div className="manage-account-content">
        <div className="manage-account-header">
          <h5>Manage Account</h5>
          <Link to="/workbench/dashboard">Back to Dashboard</Link>
        </div>
        <div className="user-profile">
          <div className="user-profile-main">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <RequiredInformation />
                <OptionalInformation />
                <ManageAccountModals />
              </>
            )}
          </div>
          <div className="user-profile-side">
            <Licenses />
            <ThirdPartyApps />
            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ManageAccountView);
