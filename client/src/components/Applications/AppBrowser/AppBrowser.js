import React, { useState } from 'react';
import { NavLink as RRNavLink, useRouteMatch } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
// import PropTypes from 'prop-types';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './AppBrowser.scss';
import * as ROUTES from '../../../constants/routes';

const AppBrowser = () => {
  const { params } = useRouteMatch();
  const [activeTab, setActiveTab] = useState();

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const { categoryDict, appDict, defaultTab, error } = useSelector(
    state => ({ ...state.apps }),
    shallowEqual
  );

  if (error.isError) {
    return (
      <div className="appDetail-error">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          style={{ marginRight: '10px' }}
        />
        {error.message ? (
          <div>{error.message}</div>
        ) : (
          <div>Something went wrong!</div>
        )}
      </div>
    );
  }

  // set activeTab to url app's category if no tab selected
  if (
    Object.keys(appDict).length &&
    params.appId &&
    !activeTab &&
    params.appId in appDict
  ) {
    toggle(appDict[params.appId].value.definition.appCategory);
  } else if (!activeTab && Object.keys(categoryDict).includes(defaultTab)) {
    toggle(defaultTab);
  }

  return (
    <div id="appBrowser-wrapper">
      <Nav id="appBrowser-sidebar">
        {Object.keys(categoryDict).map(category => (
          <NavItem key={category}>
            <NavLink
              className={activeTab === category ? 'active' : null}
              onClick={() => {
                toggle(category);
              }}
            >
              <span className="nav-content">
                <i className="icon-nav-application  category-icon" />
                <span className="nav-text">{`${category} [${categoryDict[category].length}]`}</span>
              </span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent id="appBrowser-tray" activeTab={activeTab}>
        {Object.keys(categoryDict).map(category => (
          <TabPane tabId={category} key={`${category}tabPane`}>
            <div className="apps-grid-list">
              {categoryDict[category].map(app => (
                <div key={app.value.definition.id} className="apps-grid-item">
                  <NavLink
                    tag={RRNavLink}
                    to={`${ROUTES.WORKBENCH}${ROUTES.APPLICATIONS}/${app.value.definition.id}`}
                    activeClassName="active"
                  >
                    <div className="nav-content">
                      <i
                        className={`app-icon ${
                          app.value.definition.appIcon
                            ? `icon-nav-${app.value.definition.appIcon}`
                            : 'icon-nav-application'
                        }`}
                      />
                      <span className="nav-text">
                        {app.value.definition.label}
                      </span>
                    </div>
                  </NavLink>
                </div>
              ))}
            </div>
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
};

export default AppBrowser;
