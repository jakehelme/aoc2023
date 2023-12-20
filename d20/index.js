const example1 =
`broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

function pressButton(rules) {

}

function parseInput(raw) {
	raw.split('\n').reduce((m, l) => {
		let line = l;
		const obj = {};
		if(!/\w/.test(line[0])) obj.type = line[0];
		else 
		
		l.split(' -> ')
	}, new Map())
}