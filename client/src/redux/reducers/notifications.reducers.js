import {
  getNumberOfUnreadNotifications,
  getNumberOfUnreadJobNotifications
} from 'utils/notifications';

export const initialState = {
  list: {
    notifs: [],
    unread: 0,
    unreadJobs: 0,
    total: 0,
    page: 0
  },
  loading: false,
  loadingError: false,
  loadingErrorMessage: ''
};

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case 'NEW_NOTIFICATION': {
      const updatedNotifs = [action.payload, ...state.list.notifs];
      return {
        ...state,
        list: {
          ...state.list,
          notifs: updatedNotifs,
          unread: getNumberOfUnreadNotifications(updatedNotifs),
          unreadJobs: getNumberOfUnreadJobNotifications(updatedNotifs),
          total: updatedNotifs.length
        }
      };
    }
    case 'NOTIFICATIONS_LIST_FETCH_SUCCESS':
      return {
        list: {
          ...action.payload,
          unread: getNumberOfUnreadNotifications(action.payload.notifs),
          unreadJobs: getNumberOfUnreadJobNotifications(action.payload.notifs)
        },
        loading: false,
        loadingError: false,
        loadingErrorMessage: ''
      };
    case 'NOTIFICATIONS_LIST_FETCH_START':
      return {
        ...state,
        loading: true,
        loadingError: false,
        loadingErrorMessage: ''
      };
    case 'NOTIFICATIONS_LIST_FETCH_ERROR':
      return {
        ...state,
        loadingError: true,
        loadingErrorMessage: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
