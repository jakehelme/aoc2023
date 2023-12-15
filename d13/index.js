const example =
	`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const input = await Bun.file('./d13/input.txt').text();

function transpose(arr) {
	return arr[0].map((_, i) => arr.map(x => x[i]));
}

function processInput(rawInput, shouldFixSmudges = false) {
	const patterns = rawInput.split('\n\n').map(pat => pat.split('\n').map(line => line.split('')));
	let tot = 0;
	let i = 0;
	for (let pattern of patterns) {
		if (shouldFixSmudges) {
			const [fixed, rowsReflected, isColumn] = fixSmudge(pattern);
			if (isColumn) {
				tot += rowsReflected;
			} else {
				tot += (rowsReflected * 100);
			}
		} else {
			tot += scorePattern(pattern);
		}
		i++;
	}
	return tot;
}

function countDifferences(a, b) {
	let diffCount = 0;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) diffCount++;
	}
	return diffCount;
}

function findReflectedRows(pattern) {
	search: for (let y = 0; y < pattern.length - 1; y++) {
		if (countDifferences(pattern[y], pattern[y + 1]) === 0) {
			let offset = 1;
			while (y - offset >= 0 && y + offset + 1 < pattern.length) {
				if (countDifferences(pattern[y - offset], pattern[y + 1 + offset]) !== 0) continue search;
				offset++;
			}
			return y + 1;
		}
	}
	return 0;
}

function fixSmudge(pattern) {
	const newPattern = pattern.map(x => x.slice());
	searchRow1: for (let y = 0; y < newPattern.length - 1; y++) {
		const diff = countDifferences(newPattern[y], newPattern[y + 1]);
		if (diff === 1) {
			let offset = 1;
			while (y - offset >= 0 && y + offset + 1 < newPattern.length) {
				const testDiff = countDifferences(newPattern[y - offset], newPattern[y + 1 + offset]);
				if (testDiff !== 0) continue searchRow1;
				offset++;
			}
			newPattern[y] = [...newPattern[y + 1]];
			return [newPattern, y + 1, false];
		}
	}


	searchRow0: for (let y = 0; y < newPattern.length - 1; y++) {
		const diff = countDifferences(newPattern[y], newPattern[y + 1]);
		if (diff === 0) {
			let offset = 1;
			let isFixed = false;
			let fixOffset;
			while (y - offset >= 0 && y + offset + 1 < newPattern.length) {
				const testDiff = countDifferences(newPattern[y - offset], newPattern[y + 1 + offset]);
				if (testDiff > 1) continue searchRow0;
				else if (!isFixed && testDiff === 1) {
					fixOffset = offset;
					isFixed = true;
				} else if (isFixed && testDiff === 1) {
					continue searchRow0;
				}
				offset++;
			}
			if (isFixed) {
				newPattern[y - fixOffset] = [...newPattern[y + 1 + fixOffset]];
				return [newPattern, y + 1, false];
			}
		}
	}

	const transposed = transpose(pattern);
	searchCol1: for (let y = 0; y < transposed.length - 1; y++) {
		const diff = countDifferences(transposed[y], transposed[y + 1]);
		if (diff === 1) {
			let offset = 1;
			while (y - offset >= 0 && y + offset + 1 < transposed.length) {
				const testDiff = countDifferences(transposed[y - offset], transposed[y + 1 + offset]);
				if (testDiff !== 0) continue searchCol1;
				offset++;
			}
			transposed[y] = [...transposed[y + 1]];
			return [transpose(transposed), y + 1, true];
		}
	}

	searchCol0: for (let y = 0; y < transposed.length - 1; y++) {
		const diff = countDifferences(transposed[y], transposed[y + 1]);
		if (diff === 0) {
			let offset = 1;
			let isFixed = false;
			let fixOffset;
			while (y - offset >= 0 && y + offset + 1 < transposed.length) {
				const testDiff = countDifferences(transposed[y - offset], transposed[y + 1 + offset]);
				if (testDiff > 1) continue searchCol0;
				else if (!isFixed && testDiff === 1) {
					fixOffset = offset;
					isFixed = true;
				} else if (isFixed && testDiff === 1) {
					continue searchCol0;
				}
				offset++;
			}
			if (isFixed) {
				transposed[y - fixOffset] = [...transposed[y + 1 + fixOffset]];
				return [transpose(transposed), y + 1, true];
			}
		}
	}

	throw new Error('should not have happened');
}


function scorePattern(pattern) {
	const reflectedRows = findReflectedRows(pattern);
	if (!reflectedRows) {
		const transposed = transpose(pattern);
		const reflectedCols = findReflectedRows(transposed);
		return reflectedCols;
	}
	return reflectedRows * 100;
}

console.log(processInput(example, true));
console.log(processInput(input, true));