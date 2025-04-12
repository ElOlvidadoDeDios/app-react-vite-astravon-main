export const formatDate = (isoDate: any) => {
  const date = new Date(isoDate);
  const [year, month, day] = date.toISOString().split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};
export const formatTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const hours = date.getHours().toString().padStart(2, '0'); 
  const minutes = date.getMinutes().toString().padStart(2, '0'); 
  const seconds = date.getSeconds().toString().padStart(2, '0'); 
  return `${hours}:${minutes}:${seconds}`;
};
