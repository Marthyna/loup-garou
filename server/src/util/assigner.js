const {Powers} = require('./powerTypes')

const getRandomNonRepeatedValues = (array) => {
    var copy = array.slice(0);
    
    return function() {
      if (copy.length < 1) { copy = array.slice(0); }
      var index = Math.floor(Math.random() * copy.length);
      var item = copy[index];
      copy.splice(index, 1);
      return item;
    };

}



const determineRoles = (players, werewolfProp) => {
    const nbWerewolves = Math.ceil(players.length * werewolfProp)
    const chooser = getRandomNonRepeatedValues(players)

    // for the number of werewolves, randomly choose between the players
    for(let i=0; i<nbWerewolves; i++) {
        const choosenVillager = chooser()
        choosenVillager.isWerewolf = true
    }

    // for every other player, assign the werewolf property to false
    players.forEach(element => {
        if(!element.hasOwnProperty("isWerewolf"))
            element.isWerewolf = false    
    });

    return players

}

const assignContamination = (players) => {
    const werewolfsArray = players.filter(player => player.isWerewolf)
    const chooserWerewolf = getRandomNonRepeatedValues(werewolfsArray)

    const werewolf = chooserWerewolf()
    werewolf.hasPower = true
    werewolf.powerType = Powers.Contamination

}

const assignInsomnia = (players) => {
    const humansArray = players.filter(player => !player.isWerewolf)
    const chooserHuman = getRandomNonRepeatedValues(humansArray)

    const human = chooserHuman()
    human.hasPower = true
    human.powerType = Powers.Insomnia
}

const assignGenericPower = (player, type) => {
    const powerlessArray = player.filter(player => !player.hasOwnProperty("hasPower"))
    const chooserPowerless = getRandomNonRepeatedValues(powerlessArray)

    const powerless = chooserPowerless()
    if(powerless) {
        powerless.hasPower = true
        powerless.powerType = type
    }
}


const determinePowers = (players, {insomniaProb, contaminationProb,clairvoyanceProb, psychicProb}) => {
    // determine if contamination is going to be assigned
    // (werewolf only)
    if(Math.random() <= contaminationProb)
        assignContamination(players)

    // determine if insomnia is going to be assigned
    // (human only)
    if(Math.random() <= insomniaProb)
        assignInsomnia(players)
    
    // determine if clairvoyance is going to be assigned
    if(Math.random() <= clairvoyanceProb)
        assignGenericPower(players, Powers.Clairvoyance)

    // determine if psychic is going to be assigned
    if(Math.random() <= psychicProb)
        assignGenericPower(players, Powers.Psychic)

    // for every player that didn't get a power
    players
    .filter(player => !player.hasOwnProperty("hasPower"))
    .forEach(el => {
        el.hasPower = false
        el.powerType = null
    })

    return players
}


module.exports = {
    determineRoles,
    determinePowers
}