
const createParticipantOptions = (minNbParticipants, maxNbParticipants) => {
    const participantsOptions =
        [...Array(maxNbParticipants+1).keys()]
            .filter(element => element >= minNbParticipants)
            .map(element => {
                return {
                    label: `${element}`,
                    value: element
                }
            })
    
    return participantsOptions
}

const createNightDurationOptions = () => {
    const nightDurationOptions =
        [...Array(11).keys()]
            .map(element => element + 10)
            .map(element => {
                const mod2 = (element % 2) * 3
                return {
                    label: `${Math.floor(element / 2)}:${mod2}0`,
                    value: `${Math.floor(element / 2)}:${mod2}0`
                }
            })
    return nightDurationOptions
}

const createDayDurationOptions = () => {
    const dayDurationOptions =
        [...Array(11).keys()]
            .map(element => element + 10)
            .map(element => {
                const mod2 = (element % 2) * 3
                return {
                    label: `${Math.floor(element / 2)}:${mod2}0`,
                    value: `${Math.floor(element / 2)}:${mod2}0`
                }
            })

    return dayDurationOptions
    }

const createDayStartOptions = () => {
    const dayStartOptions =
        [...Array(11).keys()]
            .map(element => element + 10)
            .map(element => {
                const mod2 = (element % 2) * 3
                return {
                    label: `${Math.floor(element / 2)}:${mod2}0`,
                    value: `${Math.floor(element / 2)}:${mod2}0`
                }
            })

    return dayStartOptions
}

const createPowerProbs = () => {
    const powerProbsOptions =
        [...Array(21).keys()]
            .map(element => {
                return {
                    label: `${element / 20}`,
                    value: element / 20
                }
            })
    
    return powerProbsOptions
}

const createWerewolfOptions = () => {
    const werewolfPropOptions =
        [...Array(11).keys()]
            .filter(element => element > 2)
            .map(element => {
                return {
                    label: `1/${element}`,
                    value: `1/${element}`
                }
            })
    return werewolfPropOptions
}


const getOptions = () => {
    //insert number of participants as options for the dropdown menu
    const participantsOptions = createParticipantOptions(5, 20)

    // night duration options creation
    const nightDurationOptions = createNightDurationOptions()

    // day duration options creation
    const dayDurationOptions = createDayDurationOptions()

    // start date options creation
    const dayStartOptions = createDayStartOptions()

    // power probabilities
    const powerProbsOptions = createPowerProbs()

    //werewolf proportion options
    const werewolfPropOptions = createWerewolfOptions()

    return {
        participantsOptions,
        dayStartOptions,
        dayStartOptions,
        dayDurationOptions,
        nightDurationOptions,
        powerProbsOptions,
        werewolfPropOptions
    }
}


export {
    getOptions
}