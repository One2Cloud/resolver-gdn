import * as luxon from 'luxon'

export const unifyTimestamp = (timestamp: number): luxon.DateTime => { 
    return timestamp.toString().length === 10 ? luxon.DateTime.fromSeconds(timestamp) : luxon.DateTime.fromMillis(timestamp);
}