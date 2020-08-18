import React from 'react';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import DataFiles from '../DataFiles';
import systemsFixture from '../fixtures/DataFiles.systems.fixture'
import filesFixture from '../fixtures/DataFiles.files.fixture';
import renderComponent from 'utils/testing';

const mockStore = configureStore();


describe('DataFiles', () => {
  it('should render Data Files with multiple private systems', () => {
    const history = createMemoryHistory();
    const store = mockStore({
      systems: systemsFixture,
      files: filesFixture,
      pushKeys: {
        modals: {
          pushKeys: false
        },
        modalProps: {
          pushKeys: {}
        }
      }
    });
    const { getByText, getAllByText } = renderComponent(
      <DataFiles />,
      store,
      history
    )
    expect(history.location.pathname).toEqual(
      '/workbench/data/tapis/private/frontera.home.username/'
    );
    expect(getAllByText(/My Data \(Frontera\)/)).toBeDefined();
    expect(getByText(/My Data \(Longhorn\)/)).toBeDefined();
  });
});
