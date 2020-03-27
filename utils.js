const r = () => {
    return Math.ceil(Math.random() * 6)
}

const decorateRoll = (roll, dices = 3) => {
    console.log(roll);
    roll = roll.map((el, index) => {
        if (index >= dices) {
            return `**${el}**`
        }
        else if (el === 6) {
            return `__${el}__`
        }
        else if (el === 1) {
            return `~~${el}~~`
        } else {
            return el;
        }
    });
    return roll;
}

const explode = (arr) => {
    let newArr = [...Array(arr.filter(el => el === 6).length)].map(el => el = r());
    if (newArr.some(el => el === 6)) {
        newArr = [...newArr, ...explode(newArr)];
    }
    return newArr;
}

module.exports = {
    r,
    decorateRoll,
    explode
}