const example =
	`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

const input = await Bun.file('./d16/input.txt').text();

const turnRight = {
	'U': 'R',
	'R': 'D',
	'D': 'L',
	'L': 'U'
};

const turnLeft = {
	'U': 'L',
	'R': 'U',
	'D': 'R',
	'L': 'D'
};

const dirMap = {
	'U': [-1, 0],
	'R': [0, 1],
	'D': [1, 0],
	'L': [0, -1]
};

const genKey = (y, x, d) => `${y},${x},${d}`;
const parseMap = rawMap => rawMap.split('\n').map(l => l.split(''));

function getEnergizedTiles(map, start) {
	const frontier = [start];
	const hasBeen = new Set();

	while (frontier.length) {
		const key = frontier.shift();
		const [y, x, dir] = key.split(',').map((c, i) => i < 2 ? Number(c) : c);
		hasBeen.add(key);
		const tile = map[y][x];
		let nextDirs;
		switch (tile) {
			case '/':
				switch (dir) {
					case 'R':
					case 'L':
						nextDirs = [turnLeft[dir]];
						break;
					case 'U':
					case 'D':
						nextDirs = [turnRight[dir]];
						break;
					default:
						throw new Error('F');
				}
				break;
			case '\\':
				switch (dir) {
					case 'R':
					case 'L':
						nextDirs = [turnRight[dir]];
						break;
					case 'U':
					case 'D':
						nextDirs = [turnLeft[dir]];
						break;
					default:
						throw new Error('F');
				}
				break;
			case '-':
				switch (dir) {
					case 'R':
					case 'L':
						nextDirs = [dir];
						break;
					case 'U':
					case 'D':
						nextDirs = [turnRight[dir], turnLeft[dir]];
						break;
					default:
						throw new Error('F');
				}
				break;
			case '|':
				switch (dir) {
					case 'R':
					case 'L':
						nextDirs = [turnRight[dir], turnLeft[dir]];
						break;
					case 'U':
					case 'D':
						nextDirs = [dir];
						break;
					default:
						throw new Error('F');
				}
				break;
			default:
				nextDirs = [dir];
				break;
		}
		for (let nextDir of nextDirs) {
			const nextPos = [y + dirMap[nextDir][0], x + dirMap[nextDir][1]];
			if (nextPos[0] >= 0 && nextPos[0] < map.length && nextPos[1] >= 0 && nextPos[1] < map[0].length) {
				const nextKey = `${nextPos[0]},${nextPos[1]},${nextDir}`;
				if (!hasBeen.has(nextKey)) {
					frontier.push(nextKey);
				}
			}
		}
	}
	const energized = Array.from(hasBeen.values()).reduce((set, curr) => {
		const [y, x, _] = curr.split(',');
		set.add(`${y},${x}`);
		return set;
	}, new Set()).size;

	return energized;
}

function findOptimalTile(rawMap) {
	const map = parseMap(rawMap);
	let maxEnergizedTiles = 0;
	for (let x = 0; x < map[0].length; x++) {
		const start = genKey(0, x, 'D');
		const energized = getEnergizedTiles(map, start);
		maxEnergizedTiles = Math.max(energized, maxEnergizedTiles);
	}

	for (let y = 0; y < map.length; y++) {
		const start = genKey(y, map[0].length - 1, 'L');
		const energized = getEnergizedTiles(map, start);
		maxEnergizedTiles = Math.max(energized, maxEnergizedTiles);
	}

	for (let x = 0; x < map[0].length; x++) {
		const start = genKey(map.length - 1, x, 'U');
		const energized = getEnergizedTiles(map, start);
		maxEnergizedTiles = Math.max(energized, maxEnergizedTiles);
	}

	for (let y = 0; y < map.length; y++) {
		const start = genKey(y, 0, 'R');
		const energized = getEnergizedTiles(map, start);
		maxEnergizedTiles = Math.max(energized, maxEnergizedTiles);
	}

	return maxEnergizedTiles;
}

console.log(getEnergizedTiles(parseMap(example), '0,0,R'));
console.time('part1');
console.log(getEnergizedTiles(parseMap(input), '0,0,R'));
console.timeEnd('part1');

console.log(findOptimalTile(example));
console.time('part2');
console.log(findOptimalTile(input));
console.timeEnd('part2');