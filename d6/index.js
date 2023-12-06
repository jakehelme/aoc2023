const example =
    `Time:      7  15   30
Distance:  9  40  200`;

const input =
    `Time:        57     72     69     92
Distance:   291   1172   1176   2026`;

function getNumberOfWaysToWin(time, record) {
    let waysToWin = 0;
    for (let i = 1; i < time; i++) {
        const timeLeft = time - i;
        const distance = timeLeft * i;
        if (distance > record) waysToWin++;
    }
    return waysToWin;
}

function doAllRaces(raceStats) {
    const races = raceStats.split('\n').map(line => line.match(/\d+/g).map(Number));
    let tot = 1;
    for (let i = 0; i < races[0].length; i++) {
        tot *= getNumberOfWaysToWin(races[0][i], races[1][i]);
    }
    return tot;
}

console.log(doAllRaces(example));
console.log(doAllRaces(input));

function doOneRace(raceStats) {
    const race = raceStats.split('\n').map(line => parseInt(line.match(/\d+/g).join('')));
    return getNumberOfWaysToWin(race[0], race[1]);
}

console.log(doOneRace(example));
console.log(doOneRace(input));
