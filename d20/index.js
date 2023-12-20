const example1 =
	`broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const example2 =
	`broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

const input = await Bun.file('./d20/input.txt').text();

function pressButton(modules, pressCount, returnCount = true, search = null) {
	let totLow = 0;
	let totHigh = 0;
	const countSig = sig => sig ? totHigh++ : totLow++;

	for (let i = 0; i < pressCount; i++) {
		const start = { module: 'broadcaster', sig: 0, input: null }
		countSig(0);
		const queue = [start];

		while (queue.length) {
			const current = queue.shift();
			let sig;
			if (current.module === 'rx' && current.sig === 0) return true;
			if (current.module === 'broadcaster') {
				sig = current.sig;
			} else if (!modules.has(current.module)) {
				continue;
			} else if (modules.get(current.module).type === '%' && current.sig === 0) {
				modules.get(current.module).state = modules.get(current.module).state ? 0 : 1;
				sig = modules.get(current.module).state;
			} else if (modules.get(current.module).type === '&') {
				modules.get(current.module).inputs.set(current.input, current.sig);
				const inputs = Array.from(modules.get(current.module).inputs.values());
				if (inputs.every(i => i)) {
					sig = 0;
					if (search && current.module === search) return true;
				}
				else {
					sig = 1;
				}
			} else continue;

			const outputs = modules.get(current.module).outputs;
			for (const output of outputs) {
				queue.push({ module: output, sig, input: current.module });
				countSig(sig)
			}
		}
	}
	return returnCount ? totLow * totHigh : false;
}

function parseInput(raw) {
	const modules = raw.split('\n').reduce((m, l) => {
		let line = l;
		const obj = {};
		if (!/\w/.test(line[0])) {
			if (line[0] === '&') obj.inputs = new Map();
			else obj.state = 0;
			obj.type = line[0];
			line = line.substr(1);
		}
		const module = line.split(' -> ')[0];
		obj.outputs = line.split(' -> ')[1].split(', ');
		m.set(module, obj);
		return m;
	}, new Map());

	for (const [key, obj] of modules) {
		for (const output of obj.outputs) {
			if (modules.has(output) && modules.get(output).type === '&') {
				modules.get(output).inputs.set(key, 0);
			}
		}
	}

	return modules;
}

console.log(pressButton(parseInput(example1), 1000));
console.log(pressButton(parseInput(example2), 1000));
console.log(pressButton(parseInput(input), 1000));

function gcd(a, b) {
	if (b == 0)	return a;
	return gcd(b, a % b);
}

function lcm(arr) {
	let ans = arr[0];
	for (let i = 1; i < arr.length; i++)
		ans = (((arr[i] * ans)) /	(gcd(arr[i], ans)));

	return ans;
}

function getPressesToTriggerRx() {
	const modules = parseInput(input);
	const rxFeeders = [];
	modules.forEach((val, key) => {
		if (val.inputs && val.inputs.size > 1 && val.outputs.indexOf('rx') === -1) rxFeeders.push(key);
	});
	const loopsOn = [];
	for (const f of rxFeeders) {
		const m = parseInput(input);
		let found = false;
		let presses = 0;
		while (!found) {
			presses++;
			found = pressButton(m, 1, false, f);
		}
		loopsOn.push(presses);
	}
	return lcm(loopsOn);
}

console.log(getPressesToTriggerRx());