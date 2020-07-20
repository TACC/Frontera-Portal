import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import "@testing-library/jest-dom/extend-expect";
import { initialState as profile } from "../../../redux/reducers/profile.reducers";
import { initialState as workbench} from '../../../redux/reducers/workbench.reducers'
import ManageAccountPage from "../index";

const mockStore = configureStore();

describe("Manage Account Page", () => {
  test("Layout of Manage Account", () => {
    const { getByText, getAllByText } = render(
      <Provider store={mockStore({ profile, workbench })}>
        <BrowserRouter>
          <ManageAccountPage />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText(/Manage Account/)).toBeInTheDocument();
    expect(getByText(/Back to Dashboard/)).toBeInTheDocument();
    expect(getAllByText(/Loading.../)).toBeDefined();
  });
});
