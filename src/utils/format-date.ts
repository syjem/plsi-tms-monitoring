export function formatDate(date: string) {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${month}-${day}-${year}`;
}
