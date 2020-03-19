import { put, takeLatest, call, all } from 'redux-saga/effects';
import Cookies from 'js-cookie';
import 'cross-fetch';

export function* getProfileData(action) {
  yield put({ type: 'GET_FORM_FIELDS' });
  const endpoints = [
    '/accounts/api/profile/',
    '/accounts/api/licenses/',
    '/accounts/api/applications/'
  ];
  const responses = yield all(
    endpoints.map(slug =>
      call(fetch, slug, {
        credentials: 'same-origin',
        ...action.options
      })
    )
  );
  const json = yield all(responses.map(res => res.json()));
  const payload = yield json.reduce((obj, val) => ({ ...obj, ...val }), {});
  yield put({ type: 'ADD_DATA', payload });
}

export function* getFormFields(action) {
  const response = yield call(fetch, '/accounts/api/fields', {
    credentials: 'same-origin',
    ...action.options
  });
  const payload = yield response.json();
  yield put({ type: 'POPULATE_FIELDS', payload });
}

export function* changePassword(action) {
  const options = {
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
    ...action.options
  };
  yield put({ type: 'CHECKING_PASSWORD' });
  const response = yield call(fetch, '/accounts/api/check/', options);
  const { verified } = yield response.json();
  yield put({ type: 'CHECKED_PASSWORD', payload: verified });
  if (verified) {
    yield call(fetch, '/accounts/change-password/', options);
  }
}

export function* editRequiredInformation(action) {
  yield call(action.callback);
  const response = yield call(fetch, '/accounts/edit-profile/', {
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
    method: 'PUT',
    body: JSON.stringify({
      flag: 'Required',
      ...action.values
    }),
    ...action.options
  });
  const json = yield response.json();
  const payload = yield {
    demographics: Object.values(json).reduce(
      (obj, val) => ({ ...obj, ...val }),
      {}
    )
  };
  yield put({ type: 'CLOSE_EDIT_REQUIRED' });
  yield put({ type: 'LOAD_DATA' });
  yield put({ type: 'ADD_DATA', payload });
}

export function* editOptionalInformation(action) {
  const { professionalLevel, website, orcidId, bio } = yield action.values;
  yield call(fetch, '/accounts/edit-profile/', {
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
    method: 'PUT',
    body: JSON.stringify({
      flag: 'Optional',
      professional_level: professionalLevel,
      orcid_id: orcidId,
      website,
      bio
    }),
    ...action.options
  });
  yield put({ type: 'CLOSE_EDIT_OPTIONAL' });
  yield put({ type: 'GET_PROFILE_DATA' });
}

export function* watchEditRequired() {
  yield takeLatest('EDIT_REQUIRED_INFORMATION', editRequiredInformation);
}

export function* watchEditOptional() {
  yield takeLatest('EDIT_OPTIONAL_INFORMATION', editOptionalInformation);
}

export function* watchChangePassword() {
  yield takeLatest('CHANGE_PASSWORD', changePassword);
}
export function* watchFormFields() {
  yield takeLatest('GET_FORM_FIELDS', getFormFields);
}
export function* watchProfileData() {
  yield takeLatest('GET_PROFILE_DATA', getProfileData);
}

export default [
  watchEditRequired(),
  watchEditOptional(),
  watchChangePassword(),
  watchFormFields(),
  watchProfileData()
];
