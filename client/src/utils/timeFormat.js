/**
 * Create a string representation of date using internal standard
 * @param {Date} dateTime - A date object
 * @returns {string}
 */
export function formatDate(dateTime) {
  return dateTime.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Create a string representation of time using internal standard
 * @param {Date} dateTime - A date object
 * @returns {string}
 */
export function formatTime(dateTime) {
  return dateTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Create a string representation of date and time using internal standard
 * @param {Date} dateTime - A date object
 * @returns {string}
 */
export function formatDateTime(dateTime) {
  return `${formatDate(dateTime)} ${formatTime(dateTime)}`;
}

/**
 * A standard-format date string or UNIX timestamp
 * @typedef {string|number} DateTimeString
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
 */
/**
 * Create a string representation of date/time using internal standard
 * @param {DateTimeString} dateTimeValue - A single value date-time representation
 * @returns {string}
 */
export function formatDateTimeFromValue(dateTimeValue) {
  const date = new Date(dateTimeValue);

  return formatDateTime(date);
}
