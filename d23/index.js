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

const dirMap = { '>': [0, 1], 'v': [1, 0], '<': [0, -1], '^': [-1, 0] }

const parseInput = raw => raw.split('\n').map(l => l.split(''));
const genKey = arr => `${arr[0]},${arr[1]}`;

function findLongestPath(map, canClimbSlopes = false) {
	let longest = 0;
	const visited = new Set();
	visited.add('0,1');
	visited.add('1,1');
	const start = [1, 1, 1, 0, 1, visited] // current y, current x, distance travelled, last y, last x, visited points
	const end = [map.length - 1, map[map.length - 1].findIndex(c => c === '.')];
	const frontier = [start];
	while (frontier.length) {
		const current = frontier.shift();
		if (current[0] === end[0] && current[1] === end[1]) {
			longest = Math.max(longest, current[2]);
			console.log(`Path found, current longest is ${longest}`);
			continue;
		}
		const cTile = map[current[0]][current[1]];
		const neighbours = [[0, 1], [1, 0], [0, -1], [-1, 0]]
			.map(d => d.map((p, i) => p + current[i]))
			.filter((n, i) => {
				const nTile = map[n[0]][n[1]];
				if (n[0] === current[3] && n[1] === current[4]) return false;
				if (nTile === '#') return false;
				if (!canClimbSlopes) {
					if (cTile === '.' && nTile === '.') return true;
					if (cTile === '>' && i === 0) return true;
					if (cTile === 'v' && i === 1) return true;
					if (cTile === '<' && i === 2) return true;
					if (cTile === '^' && i === 3) return true;
					if (cTile === '.' &&
						!(
							dirMap[nTile][0] + n[0] === current[0] &&
							dirMap[nTile][1] + n[1] === current[1]
						)
					) return true;
					return false;
				} else {
					// if (cTile === '.' && nTile === '.') return true;
					// if (nTile === '>' && (i === 0 || i === 2)) return true;
					// if (nTile === 'v' && (i === 1 || i === 3)) return true;
					// if (nTile === '<' && (i === 2 || i === 0)) return true;
					// if (nTile === '^' && (i === 3 || i === 1)) return true;
					return true;
				}
			});

		if (neighbours.length > 1) {
			for (const next of neighbours) {
				const nextKey = genKey(next);
				if (!current[5].has(nextKey)) {
					const newVisited = new Set(current[5]);
					newVisited.add(nextKey)
					frontier.push([...next, current[2] + 1, ...current.slice(0, 2), newVisited]);
				}
			}
		} else if (neighbours.length === 1) {
			const nextKey = genKey(neighbours[0]);
			if (!current[5].has(nextKey)) {
				current[5].add(nextKey);
				frontier.push([...neighbours[0], current[2] + 1, ...current.slice(0, 2), current[5]]);
			}
		}
	}
	return longest;
}

function buildGraphFromGrid(map) {
	const distanceToNodes = {};
	const nodes = {};
	const start = [1, 1];
	let last = [0, 1];
	let lastNode = '0,1';
	let dist = 1;
	const frontier = [[...start, dist, ...last, lastNode]];
	while (frontier.length) {
		const current = frontier.shift();
		const cTile = map[current[0]][current[1]];
		const neighbours = [[0, 1], [1, 0], [0, -1], [-1, 0]]
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
				// last = [...current.slice(0, 2)];
				// pos = [...neighbours[0]];
				frontier.push([...neighbours[0], current[2] + 1, ...current.slice(0,2), current[5]]);
			} else if (neighbours.length > 1) {
				const key = `${lastNode}->${current[0]},${current[1]}`;
				distanceToNodes[key] = dist;
				nodes[key] = [];
				lastNode = genKey(current);
				console.log();
			}
	}
}

// console.log(findLongestPath(parseInput(example)));
// console.log(findLongestPath(parseInput(input)));
// console.log(findLongestPath(parseInput(example), true));
// console.log(findLongestPath(parseInput(input), true));
buildGraphFromGrid(parseInput(example));