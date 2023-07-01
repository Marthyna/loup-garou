
const getDefaultDate = () => {
    // get the tomorrow day
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    // set the hours to 8 o'clock in the morning
    tomorrow.setHours(8,0,0)

    return tomorrow
}


export {
    getDefaultDate
}