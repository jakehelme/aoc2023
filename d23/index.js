const example =
	`#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`;

const input = await Bun.file('./d23/input.txt').text();

const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirMap = { '>': [0, 1], 'v': [1, 0], '<': [0, -1], '^': [-1, 0] }

const parseInput = raw => raw.split('\n').map(l => l.split(''));
const genKey = arr => `${arr[0]},${arr[1]}`;

function buildGraphFromGridRedux(map, start, end) {

	const nodes = new Map();
	nodes.set(start, []);
	nodes.set(end, []);
	for (let y = 1, my = map.length - 1; y < my; y++) {
		for (let x = 1, mx = map[0].length - 1; x < mx; x++) {
			const cTile = map[y][x];
			const current = [y, x];
			if (cTile === '#') continue;
			const neighbours = getNeighbours(current);
			if (neighbours.length > 2) {
				nodes.set(genKey(current), []);
			}
		}
	}
	for (const node of nodes.keys()) {
		const nodePos = node.split(',').map(Number);
		const paths = getNeighbours(nodePos);
		for (const pathStartingPos of paths) {
			let pos = [...pathStartingPos];
			let last = [...nodePos];
			let dist = 1;
			let nextNodeFound = false;
			while (!nextNodeFound) {
				const nextPositions = getNeighbours(pos).filter(p => !(last[0] === p[0] && last[1] === p[1]));

				if (nextPositions.length === 1) {
					last = [...pos];
					pos = [...nextPositions[0]];
					dist++;
				} else if (nextPositions.length > 1) {
					nodes.get(node).push({ key: genKey(pos), dist });
					nextNodeFound = true;
				} else {
					nodes.get(node).push({ key: genKey(pos), dist });
					nextNodeFound = true;
				}
			}
		}
	}
	return nodes;

	function getNeighbours(current) {
		return directions
			.map(d => d.map((p, i) => p + current[i]))
			.filter(p => map[p[0]][p[1]] === '.');
	}
}

function buildGraphFromGrid(map) {
	const lastNode = 'S,0,1';
	const nodes = new Map();
	nodes.set(lastNode, []);
	const start = [1, 1];
	const end = [map.length - 1, map[map.length - 1].findIndex(c => c === '.')];
	let lastPos = [0, 1];

	const nodesVisited = new Set();
	nodesVisited.add(lastNode.split(',').slice(1).join(','));
	let dist = 1;
	const frontier = [[...start, dist, ...lastPos, nodesVisited, lastNode]];
	while (frontier.length) {
		const current = frontier.shift();
		if (current[0] === end[0] && current[1] === end[1]) {
			const key = 'END';
			nodes.get(current[6]).push({ key, dist: current[2] });
			continue;
		}
		const cTile = map[current[0]][current[1]];
		const neighbours = directions
			.map(d => d.map((p, i) => p + current[i]))
			.filter(n => {
				const nTile = map[n[0]][n[1]];
				if (n[0] === current[3] && n[1] === current[4]) return false;
				if (nTile === '#') return false;
				if (/>|v|<|\^/.test(cTile)) return true;
				if (cTile === '.' && nTile === '.') return true;
				if (cTile === '.' &&
					!(
						dirMap[nTile][0] + n[0] === current[0] &&
						dirMap[nTile][1] + n[1] === current[1]
					)
				) return true;
				return false;
			});

		if (neighbours.length === 1) {
			frontier.push([...neighbours[0], current[2] + 1, ...current.slice(0, 2), current[5], current[6]]);
		} else if (neighbours.length > 1) {
			const key = genKey(current);
			const lastNode = current[6];
			let dir = getDir(current);
			const newNode = `${dir},${current[0]},${current[1]}`;

			if (!current[5].has(key)) {
				for (const next of neighbours) {
					const visited = new Set(current[5]);
					visited.add(key);
					frontier.push([...next, 1, ...current.slice(0, 2), visited, newNode]);
				}
				nodes.get(lastNode).push({ key: newNode, dist: current[2] });
				nodes.set(newNode, []);
			}
		}
	}
	return nodes;

	function getDir(current) {
		const deltaY = current[0] - current[3];
		const deltaX = current[1] - current[4];
		let dir;
		if (deltaY === -1 && deltaX === 0) dir = 'D';
		else if (deltaY === 1 && deltaX === 0) dir = 'U';
		else if (deltaY === 0 && deltaX === -1) dir = 'R';
		else if (deltaY === 0 && deltaX === 1) dir = 'L';
		return dir;
	}
}

function findLongestPath(raw) {
	let longest = 0;
	const map = parseInput(raw);
	const nodes = buildGraphFromGrid(map);
	const start = 'S,0,1';
	const end = 'END';
	const frontier = [[start, 0]];
	while (frontier.length) {
		const current = frontier.shift();
		const [key, dist] = current;
		if (key === end) {
			longest = Math.max(longest, current[1]);
			continue;
		}
		const nextArr = nodes.get(key);
		for (const next of nextArr) {
			frontier.push([next.key, dist + next.dist]);
		}
	}
	return longest;
}

function findLongestDryPath(map) {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[0].length; x++) {
			if (/>|v|<|\^/.test(map[y][x])) map[y][x] = '.';
		}
	}
	const start = `1,${map[0].findIndex(c => c === '.')}`;
	const end = `${map.length - 2},${map[map.length - 1].findIndex(c => c === '.')}`;
	map[0][map[0].findIndex(c => c === '.')] = '#';
	map[map.length - 1][map[map.length - 1].findIndex(c => c === '.')] = '#';
	let longest = 0;
	const nodes = buildGraphFromGridRedux(map, start, end);
	const visited = new Set();
	visited.add(start);
	const frontier = [[start, 2, visited]];

	while (frontier.length) {
		const current = frontier.shift();
		const connectedNodes = nodes.get(current[0]);
		for (const node of connectedNodes) {
			if (!current[2].has(node.key)) {
				const newVisited = new Set(current[2]);
				newVisited.add(node.key);
				if (node.key !== end) {
					frontier.push([node.key, current[1] + node.dist, newVisited]);
				} else {
					longest = Math.max(longest, current[1] + node.dist);
				}
			}
		}
	}
	return longest;
}

console.log(findLongestPath(example));
console.log(findLongestPath(input));

console.log(findLongestDryPath(parseInput(example)));
console.time('part2');
console.log(findLongestDryPath(parseInput(input)));
console.timeEnd('part2');