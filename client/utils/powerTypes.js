const Powers = {
    Contamination: 0,
    Insomnia: 1,
    Clairvoyance: 2,
    Psychic: 3
}

const getPowerDetails = (powerType) => {
    switch(powerType) {
        case Powers.Contamination:
            return {name: "Contamination", description: "Turn another villager into a werewolf"}
        case Powers.Insomnia:
            return {name: "Insomnia", description: "Sneak into the werewolves' den for a night"}
        case Powers.Clairvoyance:
            return {name: "Clairvoyance", description: "Discover another player's role and power each round"}
        case Powers.Psychic:
            return {name: "Psychic", description: 'Talk to a deceased villager in a private chat'}
    }
}

export {
    Powers,
    getPowerDetails
}