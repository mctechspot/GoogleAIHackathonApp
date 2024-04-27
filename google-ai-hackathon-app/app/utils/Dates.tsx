import moment from 'moment-timezone';

export const getNowUtc = () => {
  return moment.utc();
}

export const convertTimestampToMoment =(timestamp: number) => {
    const momentObject = moment.tz(timestamp, 'UTC');
    return momentObject.format('YYYY-MM-DD HH:mm:ss');
}