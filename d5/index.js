const example =
	`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

const input = await Bun.file('./d5/input.txt').text();

function getNearestLocation(almanac, seedsAreRange = false) {
	const instructions = almanac.split('\n\n').reduce((obj, section, i,) => {
		if (!i) {
			obj['seeds'] = section.match(/\d+/g).map(Number);
		} else {
			const raw = section.split('\n');
			const sectionName = raw[0].match(/[\w-]+/)[0];
			const mappings = [];
			raw.splice(0, 1);
			raw.forEach(m => mappings.push(m.split(' ').map(Number)));
			obj[sectionName] = mappings;
		}
		return obj;
	}, {});

	function mapToNext(mappings, id) {
		for (let mapping of mappings) {
			if (id >= mapping[1] && id < mapping[1] + mapping[2]) {
				return id - mapping[1] + mapping[0];
			}
		}
		return id;
	}

	const mapKeys = Object.keys(instructions).filter(x => x !== 'seeds');
	
	let minLocationId = Infinity;

	if(!seedsAreRange) {
		for (let seed of instructions.seeds) {
			let id = seed;
			for (let mapKey of mapKeys) {
				id = mapToNext(instructions[mapKey], id);
			}
			minLocationId = Math.min(minLocationId, id);
		}
	} else {
		const seedRanges = instructions.seeds.reduce((arr, seed, i) => {
			if (i % 2 === 0) arr.push([]);
			arr[arr.length - 1].push(seed);
			return arr;
		}, []);
		for (let seedRange of seedRanges) {
			console.log(seedRange);
			for (let i = seedRange[0]; i < seedRange[0] + seedRange[1]; i++) {
				let id = i;
				for (let mapKey of mapKeys) {
					id = mapToNext(instructions[mapKey], id);
				}
				minLocationId = Math.min(minLocationId, id);
			}
		}
	}
	return minLocationId;
}

console.log(getNearestLocation(example));
console.log(getNearestLocation(input));

console.log(getNearestLocation(example, true));
console.log(getNearestLocation(input, true));