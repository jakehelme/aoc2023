const example =
	`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const input = await Bun.file('./d2/input.txt').text();

function sumIdsOfPossibleGames(redMax, greenMax, blueMax, gameStats) {
	const games = gameStats.split('\n');
	let gameSum = 0;
	game: for (const [gameIndex, game] of games.entries()) {
		const sets = game.replace(/Game\s\d+:\s/, '').split(/;\s?/).map(x => x.split(/,\s?/));
		for (const set of sets) {
			for (const colourCount of set) {
				const [_, count, colour] = colourCount.match(/(\d+)\s(\w+)/);
				switch (colour) {
					case 'red':
						if (parseInt(count) > redMax) continue game;
						break;
					case 'green':
						if (parseInt(count) > greenMax) continue game;
						break;
					case 'blue':
						if (parseInt(count) > blueMax) continue game;
						break;
					default:
						throw new Error('shouldn\'t happen');
				}
			}
		}
		gameSum += gameIndex + 1;
	}
	return gameSum;
}

console.log(sumIdsOfPossibleGames(12, 13, 14, example));
console.log(sumIdsOfPossibleGames(12, 13, 14, input));

function findPowersOfMinimallyViableSetsForEachGameAndSum(gameStats) {
	const games = gameStats.split('\n');
	let finalSum = 0;
	for (const game of games) {
		let redMin = 0, blueMin = 0, greenMin = 0;
		const sets = game.replace(/Game\s\d+:\s/, '').split(/;\s?/).map(x => x.split(/,\s?/));
		for (const set of sets) {
			for (const colourCount of set) {
				const [_, count, colour] = colourCount.match(/(\d+)\s(\w+)/);
				switch (colour) {
					case 'red':
						if (parseInt(count) > redMin) redMin = parseInt(count);
						break;
					case 'green':
						if (parseInt(count) > greenMin) greenMin = parseInt(count);
						break;
					case 'blue':
						if (parseInt(count) > blueMin) blueMin = parseInt(count);
						break;
					default:
						throw new Error('shouldn\'t happen');
				}
			}
		}
		finalSum += redMin * greenMin * blueMin;
	}
	return finalSum;
}

console.log(findPowersOfMinimallyViableSetsForEachGameAndSum(example));
console.log(findPowersOfMinimallyViableSetsForEachGameAndSum(input));