const example =
	`7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

const input = await Bun.file('./d10/input.txt').text();

const dirMap = {
	'N': [-1, 0],
	'E': [0, 1],
	'S': [1, 0],
	'W': [0, -1]
};

const dirOpps = {
	'N': 'S',
	'S': 'N',
	'E': 'W',
	'W': 'E'
}

// this is the direction the scurrier must be 
// moving to be able to enter pipe
const pipeEntryDirs = {
	'|': ['N', 'S'],
	'-': ['W', 'E'],
	'L': ['S', 'W'],
	'J': ['S', 'E'],
	'7': ['N', 'E'],
	'F': ['N', 'W'],
	'.': []
};

function getNeighbours(pos, map) {
	const neighbours = [];
	if (pos[1] + 1 < map[0].length) neighbours.push('E');
	if (pos[0] + 1 < map.length) neighbours.push('S');
	if (pos[1] - 1 >= 0) neighbours.push('W');
	if (pos[0] - 1 >= 0) neighbours.push('N');
	return neighbours;
}

function parseMap(rawMap) {
	return rawMap.split('\n').map(line => line.split(''));
}

function doLoop(start, startDir, map) {
	let currPos = [start[0] + dirMap[startDir][0], start[1] + dirMap[startDir][1]];
	let currDir = startDir;
	const path = [`${start[0]},${start[1]}`];

	while (map[currPos[0]][currPos[1]] !== 'S') {
		path.push(posKey(currPos));
		const currentPipe = map[currPos[0]][currPos[1]];
		currDir = dirOpps[pipeEntryDirs[currentPipe].find(d => d !== currDir)];
		currPos[0] += dirMap[currDir][0];
		currPos[1] += dirMap[currDir][1];
	}
	return path;
}

function getStartingPos(map) {
	const start = [];
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] === 'S') start.push(...[y, x]);
		}
	}
	return start;
}

function getStartingDirs(currPos, map) {
	return getNeighbours(currPos, map).filter(n => {
		const neighbourPipe = map[currPos[0] + dirMap[n][0]][currPos[1] + dirMap[n][1]];
		return pipeEntryDirs[neighbourPipe].indexOf(n) >= 0;
	});
}

function posKey(pos) {
	return `${pos[0]},${pos[1]}`;
}

function getFarthestTile(rawMap) {
	const map = parseMap(rawMap);
	const start = getStartingPos(map);

	const startingDirs = getStartingDirs(start, map);

	const dist = {};
	for (let startDir of startingDirs) {
		const path = doLoop(start, startDir, map);
		path.forEach((p, i) => {
			if (dist[p]) dist[p] = Math.min(i, dist[p]);
			else dist[p] = i;
		});
	}

	return Math.max(...Object.values(dist));
}

console.log(getFarthestTile(example));
console.log(getFarthestTile(input));

const exampleEnclosing1 =
	`..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........`;

const exampleEnclosing2 =
	`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

const exampleEnclosing3 =
	`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

const pipes = {
	'-': '─',
	'|': '│',
	'J': '┘',
	'7': '┐',
	'F': '┌',
	'L': '└',
	'S': 'X',
	'.': '.'

}

function getEnclosedArea(rawMap) {
	const map = parseMap(rawMap);
	const start = getStartingPos(map);
	const startingDir = getStartingDirs(start, map)[0];

	const path = doLoop(start, startingDir, map);
	let toPrint = Array(map.length).fill().map(() => Array(map[0].length).fill('.'));

	path.forEach((p, i, arr) => {
		const [y, x] = p.split(',').map(Number);
		toPrint[y][x] = pipes[map[y][x]];
		if (!i) {
			const startDirs = getStartingDirs([y,x], map);
			for(let [key, val] of Object.entries(pipeEntryDirs)) {
				if (startDirs.indexOf(dirOpps[val[0]]) > -1 && startDirs.indexOf(dirOpps[val[1]]) > -1) {
					toPrint[y][x] = pipes[key];
					break;
				}
			}
		}
	});

	const exploded = Array(toPrint.length * 3).fill().map(() => Array(toPrint[0].length * 3).fill(' '));
	for(let y = 0; y < toPrint.length; y++) {
		for (let x = 0; x < toPrint[0].length; x++) {
			switch(toPrint[y][x]) {
				case '.':
					exploded[1 + y * 3][1 + x * 3] = '.';
					break;
				case '─':
					exploded[1 + y * 3][0 + x * 3] = '#';
					exploded[1 + y * 3][1 + x * 3] = '#';
					exploded[1 + y * 3][2 + x * 3] = '#';
					break;
				case '┌':
					exploded[1 + y * 3][1 + x * 3] = '#';
					exploded[1 + y * 3][2 + x * 3] = '#';
					exploded[2 + y * 3][1 + x * 3] = '#';
					break;
				case '┘':
					exploded[0 + y * 3][1 + x * 3] = '#';
					exploded[1 + y * 3][1 + x * 3] = '#';
					exploded[1 + y * 3][0 + x * 3] = '#';
					break;
				case '┐':
					exploded[1 + y * 3][0 + x * 3] = '#';
					exploded[1 + y * 3][1 + x * 3] = '#';
					exploded[2 + y * 3][1 + x * 3] = '#';
					break;
				case '└':
					exploded[0 + y * 3][1 + x * 3] = '#';
					exploded[1 + y * 3][1 + x * 3] = '#';
					exploded[1 + y * 3][2 + x * 3] = '#';
					break;
				case '│':
					exploded[0 + y * 3][1 + x * 3] = '#';
					exploded[1 + y * 3][1 + x * 3] = '#';
					exploded[2 + y * 3][1 + x * 3] = '#';
					break;
			}
		}
	}

	function isEnclosed(start, enclosedSet, enopenedSet) {
		const frontier = [start];
		const reached = new Set();
		reached.add(`${start[0]},${start[1]}`);

		while(frontier.length) {
			const current = frontier.shift();
			if (current[0] === 0 || current[0] === exploded.length - 1 || current[1] === 0 || current[1] === exploded[0].length - 1) {
				return false;
			}

			const neighbours = getNeighbours(current, exploded).map(n => [current[0] + dirMap[n][0], current[1] + dirMap[n][1]]).filter(n => exploded[n[0]][n[1]] !== '#');
			for (let n of neighbours) {
				if (exploded[n[0]][n[1]] === '.') {
					const key = `${n[0]},${n[1]}`;
					if (enclosedSet.has(key)) return true;
					else if (enopenedSet.has(key)) return false;
				}
				if (!reached.has(`${n[0]},${n[1]}`)) {
					frontier.push(n);
					reached.add(`${n[0]},${n[1]}`);
				}
			}
		}
		return true;
	}

	const enclosed = new Set();
	const enopened = new Set();

	for(let y = 0; y < exploded.length; y++) {
		for (let x = 0; x < exploded[0].length; x++) {
			if (exploded[y][x] === '.') {
				if (isEnclosed([y,x], enclosed, enopened)) enclosed.add(`${y},${x}`);
				else enopened.add(`${y},${x}`);
			}
		}
	}
	return enclosed.size;
}

function printMap(map) {
	map.forEach(line => console.log(line.join('')));
}

console.log(getEnclosedArea(exampleEnclosing1));
console.log(getEnclosedArea(exampleEnclosing2));
console.log(getEnclosedArea(exampleEnclosing3));
console.log(getEnclosedArea(input));






