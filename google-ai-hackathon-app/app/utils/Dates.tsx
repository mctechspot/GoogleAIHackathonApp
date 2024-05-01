import moment from 'moment-timezone';

export const getNowUtc = () => {
  return moment.utc();
}

export const convertTimestampToMoment =(timestamp: number) => {
    const momentObject = moment.tz(timestamp, 'UTC');
    return momentObject.format('YYYY-MM-DD HH:mm:ss');
}

export const getGivenDate = (dateString: string) => {
  return moment.utc(dateString);
}

export const formatDateWithTime = (date: any) =>{
  date = getGivenDate(date);
  return date.format('MMMM DD, YYYY HH:mm:ss');
}