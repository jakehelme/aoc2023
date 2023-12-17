import { MinPriorityQueue } from "@datastructures-js/priority-queue";

const example =
	`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const input = await Bun.file('./d17/input.txt').text();

const dirMap = {
	'U': [-1, 0],
	'R': [0, 1],
	'D': [1, 0],
	'L': [0, -1]
};

const dirOpposite = {
	'U': 'D',
	'R': 'L',
	'D': 'U',
	'L': 'R'
}

const genKey = step => `${step.loc[0]},${step.loc[1]}${step.currDir ? `,${step.currDir}` : ''},${step.distInCurrDir}`;

function findRouteWithLowestHeatLoss(rawMap, isUltra = false) {
	function getNextSteps(currentStep) {

		const nextSteps = [];
		let possibleDirs;
		if (isUltra && currentStep.distInCurrDir < 4) {
			possibleDirs = currentStep.currDir ? [currentStep.currDir] : ['R', 'D'];
		} else {
			possibleDirs = ['U', 'R', 'D', 'L'].filter(x => x !== dirOpposite[currentStep.currDir]);
		}

		for (let d of possibleDirs) {
			const newLoc = currentStep.loc.map((p, i) => p + dirMap[d][i]);
			if (
				newLoc[0] >= 0 &&
				newLoc[0] < map.length &&
				newLoc[1] >= 0 &&
				newLoc[1] < map[0].length

			) {
				const distInCurrDir = d === currentStep.currDir ? currentStep.distInCurrDir + 1 : 1;
				if ((!isUltra && distInCurrDir < 4) || (isUltra && distInCurrDir < 11)) {
					if (isUltra && newLoc[0] === end[0] && newLoc[1] === end[1]) {
						if (distInCurrDir >= 4) {
							nextSteps.push({
								loc: newLoc,
								heatLossSoFar: null,
								distInCurrDir,
								currDir: d
							});
						}
					} else {
						nextSteps.push({
							loc: newLoc,
							heatLossSoFar: null,
							distInCurrDir,
							currDir: d
						});
					}
				}
			}
		}
		return nextSteps;
	}
	const map = rawMap.split('\n').map(l => l.split(''));
	const start = [0, 0];
	const end = [map.length - 1, map[0].length - 1];
	const frontier = new MinPriorityQueue(x => x.heatLossSoFar);
	frontier.enqueue({ loc: start, heatLossSoFar: 0, distInCurrDir: 0, currDir: null });

	const cameFrom = new Map();
	const heatLossSoFar = new Map();
	cameFrom.set('0,0,0', null);
	heatLossSoFar.set('0,0,0', 0);

	while (!frontier.isEmpty()) {
		const current = frontier.dequeue();
		const currKey = genKey(current);
		if (current.loc[0] === end[0] && current.loc[1] === end[1]) break;
		const steps = getNextSteps(current);
		for (let next of steps) {
			const newCost = heatLossSoFar.get(currKey) + Number(map[next.loc[0]][next.loc[1]]);
			const nextKey = genKey(next);
			if (!heatLossSoFar.has(nextKey) || newCost < heatLossSoFar.get(nextKey)) {
				heatLossSoFar.set(nextKey, newCost);
				next.heatLossSoFar = newCost;
				frontier.enqueue(next);
				cameFrom.set(nextKey, currKey);
			}
		}
	}
	let finalPosition = [];
	const endStr = end.toString();
	for (let key of cameFrom.keys()) {
		if (key.substr(0, endStr.length) === endStr) {
			finalPosition.push(key);
		}
	}

	return finalPosition.reduce((min, curr) => Math.min(min, heatLossSoFar.get(curr)), Infinity);
}

console.log(findRouteWithLowestHeatLoss(example));
console.log(findRouteWithLowestHeatLoss(input));

console.log(findRouteWithLowestHeatLoss(example, true));
console.log(findRouteWithLowestHeatLoss(input, true));