const example =
	`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

// const example =
// 	`?###???????? 3,2,1`;

const input = await Bun.file('./d12/input.txt').text();

function countPossibleArrangements(rawSprings, isUnfolded = false) {
	const springConditionRecords = rawSprings.split('\n').map(line => line.split(' ').map((p, i) => {
		return !i ? p : p.split(',').map(Number);
	}));

	let tot = 0;
	if (!isUnfolded) {
		for (let rec of springConditionRecords) {
			tot += getViableCombos(rec[0], rec[1]);
		}
	} else {
		let i = 0;
		for (let rec of springConditionRecords) {
			console.log(++i, rec[0]);
			const firstPart = getViableCombos(rec[0], rec[1]);
			const nextFour = getViableCombos(`${rec[0][rec[0].length - 1] === '#' ? '.' : '?'}${rec[0]}`, rec[1]);
			const wrapPotentialMatch = rec[0].match(/^\?+/);

			let combinedAlts;
			if(wrapPotentialMatch && wrapPotentialMatch[0].length < 11) {
				const toJoin = Array(wrapPotentialMatch[0].length).fill('?').join('');
				const firstPartAlt = getViableCombos(`${rec[0]}${toJoin}`, rec[1]);
				const nextThreeAlt = getViableCombos(`${rec[0].substr(wrapPotentialMatch[0].length)}${toJoin}`, rec[1]);
				const lastPartAlt = getViableCombos(`${rec[0].substring(wrapPotentialMatch[0].length, rec[0].length)}`, rec[1]);
				combinedAlts = firstPartAlt * Math.pow(nextThreeAlt, 3) * lastPartAlt;
			}
			
			const combinedCombos = firstPart * Math.pow(nextFour, 4);
			if(combinedAlts) tot += combinedCombos > combinedAlts ? combinedCombos : combinedAlts;
			else tot += combinedCombos;
		}
	}

	return tot;

	function getViableCombos(springLayout, springLengths) {
		const binLayout = springLayout.replace(/\./g,'0').replace(/#/g,'1');
		const totalSprings = springLengths.reduce((t, s) => t + s);
		const shownSprings = binLayout.split('').reduce((t, c) => c === '1' ? t + 1 : t, 0);
		const matches = binLayout.matchAll(/\?/g);
		const unknowns = [];

		for (let match of matches) unknowns.push(match.index);

		const nCombos = Math.pow(2, unknowns.length);
		const combos = Array(nCombos).fill().map((_, i) => (i).toString(2).padStart(unknowns.length, '0'));
		const filtered = combos.filter(c => {
			const match = c.match(/1/g);
			const len = match ? match.length : 0;
			return len + shownSprings === totalSprings;
		});
		let viableCombos = 0;

		combos: for (let combo of filtered) {
			let base = Number(`0b${binLayout.replace(/\?/g, '0')}`);
			let add = Array(binLayout.length).fill('0');
			// let option = springLayout.split('');
			for (let j = 0; j < unknowns.length; j++) {
				add[unknowns[j]] = combo[j] === '1' ? '1' : '0';
			}
			const addS = add.join('');
			const combined = (base | Number(`0b${addS}`)).toString(2).padStart(binLayout.length, '0');
			const springs = Array.from(combined.matchAll(/1+/g));
			let j = 0;
			// for (let s of springs) {
				// if (s[0].length !== springLengths[j]) continue combos;
				// j++;
			// }
			if (springs.every((s, i) => s[0].length === springLengths[i])) viableCombos++;
		}
		return viableCombos;
	}
}

// console.log(countPossibleArrangements(example, false));
// console.time('part1');
// console.log(countPossibleArrangements(input));
// console.timeEnd('part1');

// console.log(countPossibleArrangements(example, true));
console.time('part2');
console.log(countPossibleArrangements(input, true));
console.timeEnd('part2');