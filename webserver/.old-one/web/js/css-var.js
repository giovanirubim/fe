const style = document.createElement('style');
const rules = [];
const stack = [];
const index_map = {};
const value_map = {};
let sheet = null;
export const setVar = (name, value) => {
	if (sheet === null) {
		stack.push([name, value]);
		return;
	}
	let index = index_map[name];
	if (index === undefined) {
		index = sheet.rules.length;
		index_map[name] = index;
	} else {
		sheet.removeRule(index);
	}
	sheet.insertRule(`:root{--${name}:${value};}`, index);
	value_map[name] = value;
};
export const setPx = (a, b) => {
	if (a instanceof Object) {
		for (let name in a) {
			setVar(name, a[name] + 'px');
		}
	} else {
		setVar(a, b + 'px');
	}
};
export const getVar = name => value_map[name] || null;
export const val = function(name, value) {
	if (arguments.length < 2) {
		return getVar(name);
	}
	setVar(name, value);
}
window.addEventListener('load', () => {
	document.head.appendChild(style);
	sheet = style.sheet;
	stack.forEach(args => set(...args));
});