
const example =
`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const input = await Bun.file('./d12/input.txt').text();

function countPossibleArrangements(rawSprings) {
	const springConditionRecords = rawSprings.split('\n').map(line => line.split(' ').map((p, i) => {
		return !i ? p : p.split(',').map(Number);
	}));

	let tot = 0;
	for (let rec of springConditionRecords) {
		const [springLayout, springLengths] = rec;
		const totalSprings =  springLengths.reduce((t, s) => t + s);
		const shownSprings = springLayout.split('').reduce((t, c) => c === '#' ? t + 1 : t, 0);
		const matches = springLayout.matchAll(/\?/g);
		const unknowns = [];
		
		for(let match of matches) unknowns.push(match.index);

		const nCombos = Math.pow(2, unknowns.length);
		const combos = Array(nCombos).fill().map((_, i) => (i).toString(2).padStart(unknowns.length, '0'));
		const filtered = combos.filter(c => {
			const match = c.match(/1/g)
			return match && match.length + shownSprings === totalSprings;
		});
		let viableCombos = 0;

		combos: for (let combo of filtered) {
			let option = springLayout.split('');
			for (let j = 0; j < unknowns.length; j++) {
				option[unknowns[j]] = combo[j] === '1' ? '#' : '.';
			}
			option = option.join('');
			const springs = option.matchAll(/#+/g);
			let j = 0;
			for (let s of springs) {
				if (s[0].length !== springLengths[j]) continue combos;
				j++
			}
			if (springLengths.length === j) viableCombos++;
		}
		tot += viableCombos;
	}
	
	return tot;
}

console.log(countPossibleArrangements(example));
console.time('part1');
console.log(countPossibleArrangements(input));
console.timeEnd('part1');