const example =
    `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const input = await Bun.file('./d7/input.txt').text();

const strengthP1 = {
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
    'T': 9,
    'J': 10,
    'Q': 11,
    'K': 12,
    'A': 13
}

const strengthP2 = {
    'J': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'Q': 11,
    'K': 12,
    'A': 13
}

function determineGameResult(raw, strength = strengthP1, jokersWild = false) {
    const hands = raw.split('\n')
        .reduce((hObj, line) => {
            const [hand, bid] = line.split(' ')
            hObj[hand] = { bid: Number(bid) };
            return hObj
        }, {})

    for (let curr in hands) {
        const cards = curr.split('').reduce((obj, curr) => {
            if (obj[curr]) obj[curr]++;
            else obj[curr] = 1;
            return obj;
        }, {});

        let jokerCount = 0;
        if(jokersWild && cards['J']) {
            jokerCount = cards['J'];
            delete cards['J'];
        }

        const counts = Object.values(cards).sort((a, b) => a > b ? -1 : 1);
        if (counts[0]) counts[0] += jokerCount;
        else counts.push(5);

        if (counts[0] === 5) hands[curr].handType = 1;
        else if (counts[0] === 4) hands[curr].handType = 2;
        else if (counts[0] === 3 && counts[1] === 2) hands[curr].handType = 3;
        else if (counts[0] === 3) hands[curr].handType = 4;
        else if (counts[0] === 2 && counts[1] === 2) hands[curr].handType = 5;
        else if (counts[0] === 2) hands[curr].handType = 6;
        else hands[curr].handType = 7;
    }

    const handTypeGroups = {};
    for (let [key, val] of Object.entries(hands)) {
        if (handTypeGroups[val.handType]) handTypeGroups[val.handType].push(key);
        else handTypeGroups[val.handType] = [key];
    }

    for (let handGroup of Object.values(handTypeGroups)) {
        if (handGroup.length === 1) continue;
        handGroup.sort((a, b) => {
            for (let i = 0; i < 5; i++) {
                if (strength[a[i]] > strength[b[i]]) return -1;
                else if (strength[a[i]] < strength[b[i]]) return 1;
            }
            console.log('whoops');
        });
    }
    Object.values(handTypeGroups).flat().reverse().forEach((hand, i) => {
        hands[hand].rank = i + 1;
    });

    let winnings = 0;
    for (let key in hands) winnings += hands[key].rank * hands[key].bid;
    return winnings;
}

console.log(determineGameResult(example));
console.log(determineGameResult(input));

console.log(determineGameResult(example, strengthP2, true));
console.log(determineGameResult(input, strengthP2, true));
