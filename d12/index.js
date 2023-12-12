
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
		const matches = springLayout.matchAll(/\?/g);
		const unknowns = [];
		
		for(let match of matches) unknowns.push(match.index);

		const combos = Math.pow(2, unknowns.length);
		let viableCombos = 0;

		combos: for (let i = 0; i < combos; i++) {
			const bin = (i).toString(2).padStart(unknowns.length, '0');
			let option = springLayout.split('');
			for (let j = 0; j < unknowns.length; j++) {
				option[unknowns[j]] = bin[j] === '1' ? '#' : '.';
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
console.log(countPossibleArrangements(input));