export function dateToReadable(param: string) {
  const date = new Date(param);
  //convert the date to YYYY/MM/DD Format
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month}/${day}`;
}
