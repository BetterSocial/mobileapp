import moment from "moment"

let getPollTime = (pollExpiredAtString) => {
    let currentMoment = moment()
    let pollExpiredMoment = moment(pollExpiredAtString)
    let diff = pollExpiredMoment.diff(currentMoment)

    let diffInDays = pollExpiredMoment.diff(currentMoment, 'days')
    let diffInHours = pollExpiredMoment.diff(currentMoment, 'hours')
    let diffInMinutes = pollExpiredMoment.diff(currentMoment, 'minutes')

    // Poll still continues
    if(diff > 0) {
        if(diffInDays > 0) return `${diffInDays}d left`
        if(diffInHours > 0) return `${diffInHours}h ${diffInMinutes % 60}m left`
        else `${diffInMinutes % 60}m left`
    }
    // Poll ended
    else {
        if(diffInDays < 0) return `${diffInDays}d ago`
        if(diffInHours > 0) return `${Math.abs(diffInHours)}h ${Math.abs(diffInMinutes % 60)}m ago`
        else return `${Math.abs(diffInMinutes % 60)}m ago`
    }
}

let isPollExpired = (pollExpiredAtString) => {
    return moment(pollExpiredAtString).diff(moment()) < 0
}

export {
    getPollTime,
    isPollExpired
}