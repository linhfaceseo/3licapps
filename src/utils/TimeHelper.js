
import differenceInSeconds from "date-fns/differenceInSeconds";
import format from "date-fns/format";
import moment from "moment";
import *as Util from '../utils/Util';

export const convertStringToDate = (strDate, format) => {
    if(Util.invalidOrEmptyString(strDate)) {
        return null;
    }
    return moment(strDate, format).toDate()
}

export const convertStringDateToStringDate = (strDate, originalFormat, newFormat) => {
    if(Util.invalidOrEmptyString(strDate)) {
        return null;
    }
    let date = moment(strDate, originalFormat).toDate();
    if(!!date) {
        return moment.unix(date.getTime()/1000).format(newFormat);
    }
}

export const convertTimeStampToStringDate = (timeStamp, format) => {
    return moment.unix(timeStamp/1000).format(format);
}

export const getDifference = (date) => {
    return differenceInSeconds(new Date(), date);
}

export const getParsedDate = (date, showTime = false) => {
    var diff = getDifference(date);
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;

    switch (true) {
        case diff < 30:
            if (diff <= 0) {
                return "Just now"
            }
            return diff + " secs ago";
        case diff < 2 * minute:
            return "1 min ago";
        case diff < hour:
            return `${Math.floor(diff / minute)} mins ago`;
        case Math.floor(diff / hour) === 1:
            return `1 hr ago`;
        case diff < day:
            return `${Math.floor(diff / hour)} hrs ago`;
        case diff < 2 * day:
            return `Yesterday`;
        default:
            if(showTime) {
                return format(date, "dd MMM yyyy HH:mm");
            } else {
                return format(date, "dd MMM yyyy");
            }
    }
}
