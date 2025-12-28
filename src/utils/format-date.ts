export function formatDate(date: string) {
  if (!date) return '';

  const [year, month, day] = date.split('-');
  return `${month}-${day}-${year}`;
}

export const formatISODate = (isoDate: Date) => {
  const date = new Date(isoDate);
  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
  });

  return formatted;
};
