export function convertDateToReadableFormat(date: Date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const UTCMonth = date.getUTCMonth();
  const UTCDate = date.getUTCDate();
  const UTCYear = date.getUTCFullYear();

  return `${months[UTCMonth]} ${UTCDate}, ${UTCYear}`;
}
