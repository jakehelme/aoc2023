const example =
    `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const input = await Bun.file('./d4/input.txt').text();

function calculatePoints(scratchcard) {
    const cards = scratchcard.split('\n').map(card => card.replace(/Card\s+\d+:\s+/, '').split(' | ').map(num => num.split(/\s+/)));
    let totalPoints = 0;
    for (let card of cards) {
        let cardPoints = 0;
        for (let winningNum of card[0]) {
            if (card[1].indexOf(winningNum) >= 0) cardPoints = cardPoints ? cardPoints * 2 : 1;
        }
        totalPoints += cardPoints;
    }
    return totalPoints;
}

console.log(calculatePoints(example));
console.log(calculatePoints(input));

function calculatePointsPart2(scratchcard) {
    const cards = scratchcard.split('\n').map(card => ({ numbers: card.replace(/Card\s+\d+:\s+/, '').split(' | ').map(num => num.split(/\s+/)), count: 1 }));

    for (let [index, card] of cards.entries()) {
        let numberMatches = 0;
        for (let winningNum of card.numbers[0]) {
            if (card.numbers[1].indexOf(winningNum) >= 0) numberMatches++;
        }
        for (let i = 0; i < card.count; i++) {
            for (let j = 0; j < numberMatches; j++) cards[index + j + 1].count++;
        }
    }
    return cards.reduce((tot, curr) => tot + curr.count, 0);
}

console.log(calculatePointsPart2(example));
console.log(calculatePointsPart2(input));