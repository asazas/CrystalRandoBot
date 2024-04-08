"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.process_date = void 0;
const luxon_1 = require("luxon");
const weekdays = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
};
const AMERICAN_TIME_REGEX = /^(1[0-2]|0?[1-9])(:[0-5][0-9])?\s*(AM|PM)$/;
const EUROPEAN_TIME_REGEX = /^(2[0-3]|[0-1]?[0-9]):([0-5][0-9])$/;
/**
 * Auxiliary function for the /date command.
 *
 * @remarks Returns a DateTime object from the Luxon library representing the start of the day given by "date".
 *
 * @param date - Date following dd/mm/aaaa. Can also be "today", "tomorrow", "yesterday", or a day of the week.
 * @param timezone - Time zone corresponding to the given date.
 * @param past - If a day of the week is passed, consider it to be the day immediately before (true) or after (false)
 * the current date.
 *
 * @returns DateTime object from the Luxon library representing the start of the day given by "date".
 */
function validate_date(date, timezone, past = false) {
    const date_obj = luxon_1.DateTime.fromFormat(date, 'd/M/y', { zone: timezone });
    if (date_obj.isValid) {
        return date_obj;
    }
    else if (date === 'today') {
        const today = luxon_1.DateTime.local({ zone: timezone }).startOf('day');
        return today;
    }
    else if (date === 'tomorrow') {
        const tomorrow = luxon_1.DateTime.local({ zone: timezone }).startOf('day').plus({ days: 1 });
        return tomorrow;
    }
    else if (date === 'yesterday') {
        const yesterday = luxon_1.DateTime.local({ zone: timezone }).startOf('day').minus({ days: 1 });
        return yesterday;
    }
    else if (date in weekdays) {
        const current_weekday = luxon_1.DateTime.local({ zone: timezone }).weekday;
        let desired_weekday = weekdays[date];
        if (past) {
            if (desired_weekday >= current_weekday)
                desired_weekday -= 7;
            const previous_date = luxon_1.DateTime.local({ zone: timezone })
                .startOf('day')
                .minus({ days: current_weekday - desired_weekday });
            return previous_date;
        }
        else {
            if (desired_weekday <= current_weekday)
                desired_weekday += 7;
            const next_date = luxon_1.DateTime.local({ zone: timezone })
                .startOf('day')
                .plus({ days: desired_weekday - current_weekday });
            return next_date;
        }
    }
    else {
        throw { message: 'The provided date is not valid.' };
    }
}
/**
 * Auxiliary function for the /date command.
 *
 * @remarks Updates a Luxon DateTime object to include the time of day given by the "time" parameter.
 *
 * @param date_obj - Luxon DateTime object representing the start of a day.
 * @param time - Time to update the DateTime object with.
 * @param timezone - Time zone corresponding to the date and time.
 *
 * @returns Luxon DateTime object representing the requested date and time.
 */
function validate_time(date_obj, time, timezone) {
    let hours = null, minutes = null;
    if (time === 'NOW') {
        const now = luxon_1.DateTime.local({ zone: timezone }).startOf('minute');
        hours = now.hour;
        minutes = now.minute;
        return date_obj.set({ hour: hours, minute: minutes });
    }
    const us_time = AMERICAN_TIME_REGEX.exec(time);
    if (us_time) {
        hours = parseInt(us_time[1]);
        if (us_time[3] === 'AM' && hours === 12)
            hours = 0;
        else if (us_time[3] === 'PM' && hours !== 12)
            hours += 12;
        minutes = us_time[2] ? parseInt(us_time[2].substring(1)) : 0;
        return date_obj.set({ hour: hours, minute: minutes });
    }
    const eu_time = EUROPEAN_TIME_REGEX.exec(time);
    if (eu_time) {
        hours = parseInt(eu_time[1]);
        minutes = parseInt(eu_time[2]);
        return date_obj.set({ hour: hours, minute: minutes });
    }
    throw { message: 'The provided date is not valid.' };
}
/**
 * Function invoked by the /date command.
 *
 * @remarks Process a date, time, and time zone to generate a Luxon DateTime object.
 *
 * @param date - Date following format dd/mm/yyyy. Can also be "today", "tomorrow", or a day of the week.
 * @param time - Time following format hh:mm, either 24-hour or 12-hour AM/PM. Can also be "now".
 * @param timezone - Time zone corresponding to the date and time.
 *
 * @returns Luxon DateTime object representing the requested date and time.
 */
function process_date(date, time, timezone) {
    const fecha_val = validate_date(date, timezone);
    const fecha_con_hora = validate_time(fecha_val, time, timezone);
    return fecha_con_hora;
}
exports.process_date = process_date;
//# sourceMappingURL=date_util.js.map