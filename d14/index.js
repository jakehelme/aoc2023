const example =
	`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

const input = await Bun.file('./d14/input.txt').text();

function tilt(dir, map) {
	switch(dir) {
		case 'N':
			for (let y = 0; y < map.length; y++) {
				for (let x = 0; x < map[0].length; x++ ) {
					if(map[y][x] === 'O') {
						let i = 1;
						while (y - i >= 0 && !/[#O]/.test(map[y - i][x])) {
							i++;
						}
						if (i !== 1) {
							map[y + 1 - i][x] = 'O';
							map[y][x] = '.';
						}
					}
				}
			}
			break;
		case 'S':
			for (let y = map.length - 1; y >= 0; y--) {
				for (let x = 0; x < map[0].length; x++ ) {
					if(map[y][x] === 'O') {
						let i = 1;
						while (y + i < map.length && !/[#O]/.test(map[y + i][x])) {
							i++;
						}
						if (i !== 1) {
							map[y + i - 1][x] = 'O';
							map[y][x] = '.';
						}
					}
				}
			}
			break;
		case 'W':
			for (let x = 0; x < map[0].length; x++) {
				for (let y = 0; y < map.length; y++) {
					if(map[y][x] === 'O') {
						let i = 1;
						while (x - i >= 0 && !/[#O]/.test(map[y][x - i])) {
							i++;
						}
						if (i !== 1) {
							map[y][x + 1 - i] = 'O';
							map[y][x] = '.';
						}
					}
				}
			}
			break;
		case 'E':
			for (let x = map[0].length - 1; x >= 0; x--) {
				for (let y = 0; y < map.length; y++) {
					if(map[y][x] === 'O') {
						let i = 1;
						while (x + i < map[0].length && !/[#O]/.test(map[y][x + i])) {
							i++;
						}
						if (i !== 1) {
							map[y][x - 1 + i] = 'O';
							map[y][x] = '.';
						}
					}
				}
			}
			break;
		default:
			throw new Error('F')
	}
}

function determineWeightOnNorthSupport(map) {
	return map.reduce((tot, row, i) => tot + (row.reduce((t, x) => t + (x === 'O' ? 1 : 0), 0) * (map.length - i)), 0);
}

function parseMap(rawMap) {
	return rawMap.split('\n').map(row => row.split(''));
}

function runLoop(rawMap) {
	let map = parseMap(rawMap);
	const tiltOrder = ['N', 'W', 'S', 'E'];
	let i = 0;
	const freq = {};
	while(i < 4000) {
		tilt(tiltOrder[i%4], map);
		if (i % 4 === 3) {
			const weight = determineWeightOnNorthSupport(map);
			if (freq[weight]) {
				freq[weight].count++;
				freq[weight].lastCycle = (i+1)/4;
			}
			else freq[weight] = {count:1, firstCycle: (i+1)/4, lastCycle: (i+1)/4};
		}
		i++;
	}
	
	for (let key in freq) {
		if (freq[key].lastCycle === 1000) return Number(key);
	}
}

function runOnce(rawMap) {
	const map = parseMap(rawMap);
	tilt('N', map);
	return determineWeightOnNorthSupport(map);
}

console.log(runOnce(example));
console.log(runOnce(input));

console.log(runLoop(example));
console.log(runLoop(input));
