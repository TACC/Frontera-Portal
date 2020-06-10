const initialTicketList = {
  content: [],
  displayed: 0,
  loading: false,
  loadingError: false,
  loadingErrorMessage: ''
};

export function ticketList(state = initialTicketList, action) {
  switch (action.type) {
    case 'TICKET_LIST_FETCH_STARTED':
      return {
        ...state,
        content: [],
        loading: true,
        loadingError: false,
        loadingErrorMessage: ''
      };
    case 'TICKET_LIST_DISPLAY_UPDATE':
      return {
        ...state,
        displayed: action.payload
      };
    case 'TICKET_LIST_FETCH_SUCCESS':
      return {
        ...state,
        content: action.payload,
        loading: false,
        loadingError: false,
        loadingErrorMessage: ''
      };
    case 'TICKET_LIST_FETCH_ERROR':
      return {
        ...state,
        content: [],
        loadingError: true,
        loadingErrorMessage: action.payload,
        loading: false
      };
    default:
      return state;
  }
}

const initialDetailedTicketView = {
  ticketId: null,
  ticketSubject: null,
  ticketSubjectLoading: false,
  ticketSubjectError: false,
  content: [],
  showItems: [],
  loading: false,
  loadingError: false,
  loadingErrorMessage: '',
  replying: false,
  replyingError: false,
  replyingErrorMessage: ''
};

let showItemSet;

export function ticketDetailedView(state = initialDetailedTicketView, action) {
  switch (action.type) {
    case 'TICKET_DETAILED_VIEW_INIT_MODAL':
      return {
        ...initialDetailedTicketView,
        ticketId: action.payload.ticketId
      };
    case 'TICKET_DETAILED_VIEW_FETCH_HISTORY_STARTED':
      return {
        ...state,
        loading: true,
        loadingError: false,
        loadingErrorMessage: ''
      };
    case 'TICKET_DETAILED_VIEW_FETCH_HISTORY_SUCCESS':
      return {
        ...state,
        content: action.payload,
        loading: false,
        loadingError: false,
        loadingErrorMessage: ''
      };
    case 'TICKET_DETAILED_VIEW_FETCH_HISTORY_ERROR':
      return {
        ...state,
        loadingError: true,
        loadingErrorMessage: action.payload,
        loading: false
      };
    case 'TICKET_DETAILED_VIEW_FETCH_TICKET_SUBJECT_STARTED':
      return {
        ...state,
        ticketSubjectLoading: true
      };
    case 'TICKET_DETAILED_VIEW_FETCH_TICKET_SUBJECT_SUCCESS':
      return {
        ...state,
        ticketSubject: action.payload,
        ticketSubjectLoading: false,
        ticketSubjectError: false
      };
    case 'TICKET_DETAILED_VIEW_FETCH_TICKET_SUBJECT_ERROR':
      return {
        ...state,
        ticketSubjectLoading: false,
        ticketSubjectError: true
      };
    case 'TICKET_DETAILED_VIEW_TOGGLE_SHOW_ITEM':
      showItemSet = new Set(state.showItems);
      if (state.showItems.includes(action.payload.index)) {
        showItemSet.delete(action.payload.index);
      } else {
        showItemSet.add(action.payload.index);
      }

      return {
        ...state,
        showItems: [...showItemSet.values()]
      };
    case 'TICKET_DETAILED_VIEW_REPLY_STARTED':
      return {
        ...state,
        replying: true,
        replyingError: false,
        replyingErrorMessage: ''
      };
    case 'TICKET_DETAILED_VIEW_REPLY_SUCCESS':
      return {
        ...state,
        replying: false,
        content: [...state.content, action.payload]
      };
    case 'TICKET_DETAILED_VIEW_REPLY_FAILED':
      return {
        ...state,
        replying: false,
        replyingError: true,
        replyingErrorMessage: action.payload
      };
    default:
      return state;
  }
}

const initialTicketCreateState = {
  creating: false,
  creatingError: false,
  creatingErrorMessage: '',
  creatingSuccess: false,
  createdTicketId: null
};

export function ticketCreate(state = initialTicketCreateState, action) {
  switch (action.type) {
    case 'TICKETS_CREATE_INIT':
      return initialTicketCreateState;
    case 'TICKET_CREATE_STARTED':
      return {
        ...initialTicketCreateState,
        creating: true
      };
    case 'TICKET_CREATE_FAILED':
      return {
        ...initialTicketCreateState,
        creatingError: true,
        creatingErrorMessage: action.payload
      };
    case 'TICKET_CREATE_SUCCESS':
      return {
        ...initialTicketCreateState,
        creatingSuccess: true,
        createdTicketId: action.payload
      };
    default:
      return state;
  }
}
