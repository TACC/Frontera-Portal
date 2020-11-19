const initialState = {
  categoryDict: {},
  appDict: {},
  appIcons: {},
  error: { isError: false },
  loading: false,
  defaultTab: '',
  tray: {}
};

function unpackCategoryDict(tabs) {
  let categoryDict = {};
  tabs.forEach((tab) => {
    categoryDict[tab.title] = tab.apps;
  });
  return categoryDict;
}

function cacheAppDef(appDict, definition) {
  let result = { ...appDict };
  result[definition.id] = definition;
  return result;
}

export function apps(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_APP': {
      return {
        ...state,
        appDict: cacheAppDef(state.appDict, action.payload)
      }
    }
    case 'GET_APPS_SUCCESS': {
      return {
        ...state,
        categoryDict: unpackCategoryDict(action.payload.tabs),
        appDict: action.payload.definitions,
        loading: false
      };
    }
    case 'GET_APPS_START':
      return {
        ...state,
        loading: true,
        error: { isError: false }
      };
    case 'GET_APPS_ERROR':
      return {
        ...state,
        error: {
          ...action.payload,
          message: action.payload,
          isError: true
        },
        loading: false
      };
    default:
      return state;
  }
}

export function app(
  state = {
    definition: {},
    error: { isError: false },
    loading: false
  },
  action
) {
  switch (action.type) {
    case 'LOAD_APP':
      return {
        ...state,
        definition: action.payload,
        loading: false
      };
    case 'GET_APP_START':
      return {
        ...state,
        loading: true,
        error: { isError: false },
        definition: {}
      };
    case 'GET_APP_ERROR':
      return {
        ...state,
        error: {
          ...action.payload,
          message: action.payload.message,
          isError: true
        },
        loading: false
      };
    default:
      return state;
  }
}
