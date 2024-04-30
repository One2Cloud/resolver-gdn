import * as luxon from 'luxon'

export const unifyTimestamp = (timestamp: number): luxon.DateTime => { 
    return luxon.DateTime.fromSeconds(
    Math.floor(timestamp.toString().length === 10 
    ? luxon.DateTime.fromSeconds(timestamp).toSeconds() 
    : luxon.DateTime.fromMillis(timestamp).toSeconds())
    )
}