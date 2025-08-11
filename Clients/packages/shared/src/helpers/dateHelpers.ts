export const dateToShortString = (date: Date | string | undefined): string => {
  if (!date) {
    return '-';
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '-';
  }
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

export const dateTimeToShortString = (date: Date | string | undefined): string => {
  if (!date) {
    return '-';
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '-';
  }
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
