import React from "react";
import { Router, useHistory } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import DataFilesBreadcrumbs from "./DataFilesBreadcrumbs";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import systemsFixture from '../fixtures/DataFiles.systems.fixture'

function renderComponent(component, store, history) {
  return render(
    <Provider store={store}>
      <Router history={history}>{component}</Router>
    </Provider>
  );
}

const mockStore = configureStore();

describe("DataFilesBreadcrumbs", () => {
  it("render breadcrumbs", () => {
    const store = mockStore({
      systems: systemsFixture
    });
    const history = createMemoryHistory();
    const { getByText, debug } = renderComponent(
        <DataFilesBreadcrumbs
          api="tapis"
          scheme="private"
          system="frontera.home.username"
          path="/path/to/the/files"
          section="FilesListing"
        />,
        store,
        createMemoryHistory()
    );

    expect(getByText(/My Data \(Frontera\)/)).toBeDefined();
    expect(
      getByText(/My Data \(Frontera\)/)
        .closest("a")
        .getAttribute("href")
    ).toEqual("/workbench/data/tapis/private/frontera.home.username/");
    expect(
      getByText(/the/)
        .closest("a")
        .getAttribute("href")
    ).toEqual("/workbench/data/tapis/private/frontera.home.username/path/to/the/");
    expect(
      getByText(/files/)
        .closest("a")
    ).toBeNull();
  });
});
