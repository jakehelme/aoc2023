const example1 =
	`broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

function pressButton(rules) {
	const queue = [];

}

function parseInput(raw) {
	return raw.split('\n').reduce((m, l) => {
		let line = l;
		const obj = {};
		if (!/\w/.test(line[0])) {
			if(line[0] === '%')
			obj.type = line[0];
			line = line.substr(1);
		}
		const module = line.split(' -> ')[0];
		obj.outputs = line.split(' -> ')[1].split(', ');
		m.set(module, obj);
		return m;
	}, new Map());
}

console.log(pressButton(parseInput(example1)));