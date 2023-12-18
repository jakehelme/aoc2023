const example =
	`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

const input = await Bun.file('./d18/input.txt').text();

function getLagoonVolume(rawMap) {
	const trenches = rawMap.split('\n').map(l => l.split(' ').reduce((obj, p, i) => {
		if (i === 1) obj['dist'] = Number(p);
		else if (i === 2) obj['colour'] = p.substr(1, 7);
		else obj['dir'] = p;
		return obj;
	}, {}));

	let maxW = 0, minW = Infinity;
	let maxH = 0, minH = Infinity;
	let currentW = 1;
	let currentH = 1;
	for (const trench of trenches) {
		switch (trench.dir) {
			case 'R':
				currentW += trench.dist;
				maxW = Math.max(currentW, maxW);
				break;
			case 'L':
				currentW -= trench.dist;
				minW = Math.min(currentW, minW);
				break;
			case 'D':
				currentH += trench.dist;
				maxH = Math.max(currentH, maxH);
				break;
			case 'U':
				currentH -= trench.dist;
				minH = Math.min(currentH, minH);
				break;
			default:
				throw new Error('F');
		}
	}

	const map = Array(maxH - minH + 1).fill().map(() => Array(maxW - minW + 1).fill('.'));
	const startY = minH > 0 ? 0 : Math.abs(minH) + 1;
	const startX = minW > 0 ? 0 : Math.abs(minW) + 1;
	map[startY][startX] = '#';
	let pos = [startY, startX];
	for (const trench of trenches) {
		let dist
		switch (trench.dir) {
			case 'R':
				dist = pos[1] + trench.dist;
				for (let x = pos[1] + 1; x <= dist; x++) {
					map[pos[0]][x] = '#'
					pos[1]++;
				}
				break;
			case 'L':
				dist = pos[1] - trench.dist;
				for (let x = pos[1] - 1; x >= dist; x--) {
					map[pos[0]][x] = '#'
					pos[1]--;
				}
				break;
			case 'D':
				dist = pos[0] + trench.dist;
				for (let y = pos[0] + 1; y <= dist; y++) {
					map[y][pos[1]] = '#'
					pos[0]++;
				}
				break;
			case 'U':
				dist = pos[0] - trench.dist;
				for (let y = pos[0] - 1; y >= dist; y--) {
					map[y][pos[1]] = '#'
					pos[0]--;
				}
				break;
			default:
				throw new Error('F');
		}
	}

	// map.forEach(l => console.log(l.join('')));

	const filled = new Set();
	const unfilled = new Set();

	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[0].length; x++) {
			const key = `${y},${x}`;
			if (map[y][x] === '#') {
				filled.add(key);
			}
			else {
				const frontier = [[y, x]];
				const reached = new Set();
				reached.add(`${y},${x}`)
				bfs: while (frontier.length) {
					const [cy, cx] = frontier.pop();
					const neighbours = [[-1, 0], [0, 1], [1, 0], [0, -1]]
						.map(p => [cy + p[0], cx + p[1]])

					const edges = neighbours.filter(p => p[0] === 0 || p[0] === map.length || p[1] === 0 || p[1] === map[0].length);
					if (edges.length) {
						unfilled.add(`${cy},${cx}`);
						break;
					}
					
					for (const next of neighbours) {
						const nKey = `${next[0]},${next[1]}`;

						if (filled.has(nKey)) {
							filled.add(`${cy},${cx}`);
							break bfs;
						}
						else if (unfilled.has(nKey)) {
							unfilled.add(`${cy},${cx}`);
							break bfs;
						}

						if (!reached.has(nKey)) {
							frontier.push(next);
							reached.add(nKey);
						}
					}
				}
			}
			// if (borderSections % 2) filled++;
			// for (let i = x + 1; i < map[0].length; i++) {
			// 	if (map[y][i] === '#') {
			// 		for (let j = x - 1; j >= 0; j--) {
			// 			if (map[y][j] === '#') {
			// 				filled++;
			// 				break;
			// 			}
			// 		}
			// 		break;
			// 	}
			// }
		}
	}

	return filled.size;
}

console.log(getLagoonVolume(example));
console.log(getLagoonVolume(input));