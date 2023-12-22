const example =
	`...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

const input = await Bun.file('./d21/input.txt').text();

const genKey = arr => `${arr[0]},${arr[1]}`;

function getShortestPaths(map, start) {
	const frontier = [[...start, 0]];
	const reached = new Map();
	reached.set(genKey(frontier[0]), 0);
	while (frontier.length) {
		const current = frontier.shift();
		const neighbours = [[0, 1], [1, 0], [0, -1], [-1, 0]].reduce((arr, dir) => {
			const neighbour = dir.map((d, i) => d + current[i]);
			if (neighbour[0] >= 0 &&
				neighbour[0] < map.length &&
				neighbour[1] >= 0 &&
				neighbour[1] < map[0].length &&
				map[neighbour[0]][neighbour[1]] !== '#') arr.push(neighbour);
			return arr;
		}, []);

		for (const next of neighbours) {
			const toQueue = [...next, current[2] + 1];
			const key = genKey(toQueue);
			if (!reached.has(key)) {
				frontier.push(toQueue);
				reached.set(key, toQueue[2]);
			}
		}
	}

	return reached;
}

function getReachableGardensForBoundedMap(map, start, steps) {
	const shortestPaths = getShortestPaths(map, start);
	const evenOddTest = steps % 2;
	let reachableGardens = 0;
	for (const [_, dist] of shortestPaths) {
		if (dist <= steps && dist % 2 === evenOddTest) reachableGardens++;
	}
	return reachableGardens;
}

function parseInput(raw) {
	let start;
	const map = raw.split('\n').map((l, y) => l.split('').map((c, x) => {
		if (c === 'S') {
			start = [y, x];
			return '.';
		}
		return c;
	}));
	return [map, start];
}

console.log(getReachableGardensForBoundedMap(...parseInput(example), 6));
console.log(getReachableGardensForBoundedMap(...parseInput(input), 64));

// this helped a lot! https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21
function getReachableGardensForUnboundedMap(map, start, steps) {
	const shortestPaths = getShortestPaths(map, start);
	const stepsToEdge = Math.floor(map.length / 2);
	const evenCorners = [...shortestPaths.values()].filter(val => val % 2 === 0 && val > stepsToEdge).length;
	const oddCorners = [...shortestPaths.values()].filter(val => val % 2 === 1 && val > stepsToEdge).length;

	const evenFull = [...shortestPaths.values()].filter(val => val % 2 === 0).length;
	const oddFull = [...shortestPaths.values()].filter(val => val % 2 === 1).length;

	const n = ((steps - ((map.length - 1) / 2)) / map.length);

	const oddsFullCount = ((n + 1) ** 2) * oddFull;
	const evensFullCount = (n ** 2) * evenFull;
	const oddCornersCount = (n + 1) * oddCorners;
	const evenCornersCount = n * evenCorners;

	return oddsFullCount + evensFullCount - oddCornersCount + evenCornersCount
}

console.log(getReachableGardensForUnboundedMap(...parseInput(input), 26501365));
