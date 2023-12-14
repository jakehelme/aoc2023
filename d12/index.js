import _ from 'lodash';

const example =
	`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const input = await Bun.file('./d12/input.txt').text();

function countPossibleArrangements(rawSprings, isUnfolded = false) {
	const getPossibleCombos = _.memoize(function getCombos(springLayout, springLengths) {

		if (!springLengths.length) return springLayout.indexOf('#') === -1 ? 1 : 0;
		if (!springLayout.length) return 0;

		const next = springLayout[0];
		const nextLength = springLengths[0];

		function spring() {
			const current = springLayout.substr(0, nextLength).replace(/\?/g, '#');

			if (current !== '#'.repeat(nextLength)) return 0;

			if (springLayout.length === nextLength) return springLengths.length === 1 ? 1 : 0;

			if (/[\.\?]/.test(springLayout[nextLength])) return getPossibleCombos(springLayout.substr(nextLength + 1), springLengths.slice(1))

			return 0;
		}

		function noSpring() {
			return getPossibleCombos(springLayout.substr(1), springLengths);
		}

		let result;
		if (next === '#') {
			result = spring();
		} else if (next === '.') {
			result = noSpring();
		} else if (next === '?') {
			result = spring() + noSpring();
		} else throw new Error('nope');

		return result;
	}, function keyResolver(...args) {
		return `${args[0]}|${args[1]}`
	});

	const springConditionRecords = rawSprings.split('\n').map(line => line.split(' ').map((p, i) => {
		return !i ? p : p.split(',').map(Number);
	}));

	let tot = 0;
	if (!isUnfolded) {
		for (let rec of springConditionRecords) {
			tot += getPossibleCombos(rec[0], rec[1]);
		}
	} else {
		for (let [i, rec] of Object.entries(springConditionRecords)) {
			tot += getPossibleCombos(Array(5).fill(rec[0]).join('?'), Array(rec[1].length * 5).fill().map((_, i) => rec[1][i % rec[1].length]));
		}
	}

	return tot;
}

console.log(countPossibleArrangements(example, false));
console.time('part1');
console.log(countPossibleArrangements(input));
console.timeEnd('part1');

console.log(countPossibleArrangements(example, true));
console.time('part2');
console.log(countPossibleArrangements(input, true));
console.timeEnd('part2');