
const example =
`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

function countPossibleArrangements(rawSprings) {
	const springConditionRecords = rawSprings.split('\n').map(line => line.split(' ').map((p, i) => {
		return !i ? p : p.split(',').map(Number);
	}));

	for (let rec of springConditionRecords) {
		const [springLayout, springLengths] = rec;
		const missingCount = springLayout.match(/\?/g);
		console.log();
	}

	console.log();
}

console.log(countPossibleArrangements(example));