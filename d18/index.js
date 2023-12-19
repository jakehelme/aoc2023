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

const dirMap = { '0': 'R', '1': 'D', '2': 'L', '3': 'U' };

function merge(ranges) {
	const result = []
	let last;

	ranges.forEach(function (range) {
		if (!last || range[0] > last[1]) {
			last = range;
			result.push(last);
		} else if (range[1] > last[1])
			last[1] = range[1];
			if (!range[2]) last[2] = false;
	});

	return result;
}

function getLagoonVolume(rawMap, useHex = false) {
	function print() {
		const map = Array(maxH - minH + 1).fill().map(() => Array(maxW - minW + 1).fill('.'));
		map[startY][startX] = '#';
		for (const trench of trenches) {
			let dist;
			switch (trench.dir) {
				case 'R':
					dist = pos[1] + trench.dist;
					for (let x = pos[1] + 1; x <= dist; x++) {
						map[pos[0]][x] = '#';
						pos[1]++;
					}
					break;
				case 'L':
					dist = pos[1] - trench.dist;
					for (let x = pos[1] - 1; x >= dist; x--) {
						map[pos[0]][x] = '#';
						pos[1]--;
					}
					break;
				case 'D':
					dist = pos[0] + trench.dist;
					for (let y = pos[0] + 1; y <= dist; y++) {
						map[y][pos[1]] = '#';
						pos[0]++;
					}
					break;
				case 'U':
					dist = pos[0] - trench.dist;
					for (let y = pos[0] - 1; y >= dist; y--) {
						map[y][pos[1]] = '#';
						pos[0]--;
					}
					break;
				default:
					throw new Error('F');
			}
		}
		map.forEach(l => console.log(l.join('')));
	}
	let trenches;
	if (!useHex) {
		trenches = rawMap.split('\n').map(l => l.split(' ').reduce((obj, p, i) => {
			if (i === 1) obj['dist'] = Number(p);
			else if (i === 2) obj['colour'] = p.substr(1, 7);
			else obj['dir'] = p;
			return obj;
		}, {}));
	} else {
		trenches = rawMap.split('\n').map(l => {
			const hex = Number(`0x${l.split(' ')[2].substr(2, 5)}`);
			const dir = dirMap[l.split(' ')[2].substr(7, 1)];
			return { dist: hex, dir };
		});
	}

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
	
	const startY = minH > 0 ? 0 : Math.abs(minH) + 1;
	const startX = minW > 0 ? 0 : Math.abs(minW) + 1;
	
	let pos = [startY, startX];
	
	// print();

	let vertices = [];
	pos = [startY, startX];
	for (let i = 0; i < trenches.length; i++ ) {
		const trench = trenches[i];
		let isVertical = false;
		const p1 = [...pos];
		let p2;
		switch (trench.dir) {
			case 'R':
				p2 = [p1[0], p1[1] + trench.dist];
				break;
			case 'D':
				p2 = [p1[0] + trench.dist, p1[1]];
				isVertical = true;
				break;
			case 'L':
				p2 = [p1[0], p1[1] - trench.dist];
				break;
			case 'U':
				isVertical = true;
				p2 = [p1[0] - trench.dist, p1[1]]
				break;
			default:
				throw new Error('F');
		}
		let isBisector = true;
		if (!isVertical) {
			if (i) {
				if (trenches[i - 1].dir !== trenches[i + 1].dir) {
					isBisector = false;
				}
			} else {
				if (trenches[trenches.length - 1].dir !== trenches[i + 1].dir) {
					isBisector = false;
				}
			}
		}
		vertices.push([p1, p2, isBisector]);
		pos = [...p2];
	}

	let cubesDug = 0;
	const height = maxH - minH + 1
	for (let y = 0; y < height; y++) {
		console.log(`${y+1}/${height}`);
		let intersectingVertices = [];
		for (const vertex of vertices) {
			const [y1, x1] = vertex[0];
			const [y2, x2] = vertex[1];
			const xRange = [x1, x2].sort((a, b) => a - b);
			const yRange = [y1, y2].sort((a, b) => a - b);
			if (y >= yRange[0] && y <= yRange[1]) {
				intersectingVertices.push([...xRange, vertex[2]]);
			}
		}
		intersectingVertices.sort((a, b) => a[0] - b[0])
		const ranges = merge(intersectingVertices);
		
		for (let i = 0; i < ranges.length; i++) {
			cubesDug += ranges[i][1] - ranges[i][0] + 1;
		}
		for (let i = 0; i < ranges.length; i++) {
			const intersectionsInFront = ranges.slice(i).filter(r => r[2]).length;
			if (intersectionsInFront % 2 === 1) {
				if (!i) cubesDug += ranges[i][0] - 1;
				else cubesDug += ranges[i][0] - ranges[i - 1][1] - 1;
			}
		}
	}

	return cubesDug;
}

console.log(getLagoonVolume(example));
console.log(getLagoonVolume(input));
console.log(getLagoonVolume(example, true));
console.log(getLagoonVolume(input, true));