export class ButtonData {
	constructor(key) {
		this.key = key;
		this.isCurrentGoal = false;
		this.pressed = false;
		this.index = undefined;
	}

	step(isGoal, index) {
		this.isCurrentGoal = isGoal;
		this.pressed = false;
		this.index = index;
	}

	reset(key) {
		this.isCurrentGoal = false;
		this.pressed = false;
		this.key = key;
	}
}

export function initButtons(amount = 16) {
	const buttons = [];

	const rnd = () => Math.random() * 25 + 97;
	const used = [];
	for (let i = 0; i < amount; i++) {
		let letter;
		do {
			letter = String.fromCharCode(rnd());
		} while (used.includes(letter));
		used.push(letter);
		buttons.push(new ButtonData(letter));
	}
	return buttons;
}
