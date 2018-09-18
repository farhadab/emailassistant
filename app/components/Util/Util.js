export function processISODate(isoDateString){
    let date = new Date(isoDateString);
    let today = new Date;
    today.setHours(0,0,0);
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    if (date.getTime() < lastWeek.getTime()){
        return date.toLocaleDateString();
    } else {
        // within last week
        if (date.getTime() < yesterday.getTime()){
            // not the best solution, but works for now...
            let days = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ]
            return days[date.getDay()];
        } else {
            if (date.getTime() >= yesterday.getTime()
                && date.getTime() < today.getTime()){
                return 'Yesterday';
            } else {
                return date.toLocaleTimeString();
            }
        }
    }
}
