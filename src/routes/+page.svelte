<script>
	import { initButtons } from '$lib/ButtonData.js';
	import Button from '../components/Button.svelte';
	import { dev } from '$app/environment';

	let buttons = initButtons();
	let score = 0;
	let best = 0;
	let gameStatus = 'before'; // before / playing / after
	let idle = true; // Ignores all events (in between game steps)
	let pressCount;
	const pressPerStep = 6;

	const startGame = () => {
		if (gameStatus === 'loss') buttons = initButtons();
		gameStatus = 'playing';
		score = 0;
		idle = false;
		startStep();
	};

	const startStep = () => {
		pressCount = 0;

		const goals = new Array(16).fill(false);
		for (let i = 0; i < pressPerStep; ) {
			let index = Math.floor(Math.random() * 16);
			if (!goals[index]) {
				goals[index] = true;
				i++;
			}
		}

		for (const i in buttons) {
			buttons[i].step(goals[i]);
		}
		buttons = buttons;
	};

	const onKeyDown = (e) => {
		if (idle) return;
		const k = e.key;
		if (buttons.every((btn) => btn.key !== k)) lose();
	};

	const onPress = (i) => {
		if (idle) return;

		if (!buttons[i].isCurrentGoal || buttons[i].pressed) return lose();
		buttons[i].pressed = true;
		pressCount++;
		score++;
		if (score > best) best = score;
		if (pressCount === pressPerStep) {
			startStep();
		}
	};

	const lose = () => {
		idle = true;
		gameStatus = 'loss';
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<header>quickpress</header>

<div class="game-container">
	<div class="scores">
		<div>{score}</div>
		<div>{best}</div>
	</div>
	<div class={'game-board ' + (gameStatus === 'loss' ? 'loss' : '')}>
		{#each buttons as data, index}
			<Button bind:data index on:pressed={() => onPress(index)} />
		{/each}
	</div>
</div>
<button on:click={startGame}>Play</button>

{#if dev}
	<div class="dev-info">
		<div>{PKG.name} - {PKG.version}</div>
		<div>{navigator.userAgent}</div>
	</div>
{/if}

<style>
	:global(body) {
		background: #333;
		margin: 0;
		text-align: center;
	}

	header {
		position: sticky;
		top: 0;
		left: 0;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;
		width: 100%;
		font: 20pt Helvetica;
		overflow: hidden;
		&:before,
		&:after {
			content: 'INDEV';
			position: absolute;
			right: 0;
			top: 0;
			background-image: linear-gradient(to right, #000 49%, #e8ba00 50%);
			background-size: 30%;
			font: bold 11pt Arial;
			color: red;
			padding: 3px 25px;
			transform: translate(25%, 50%) rotate(45deg);
		}
	}
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 20px 0;
	}

	.scores {
		font: bold 34pt Arial;
		margin: 20px 0;
		text-align: center;
		& div + div {
			font: 15pt Arial;
		}
	}

	.game-board {
		position: relative;
		overflow: hidden;
		background: #bbb;
		padding: 10px;
		border-radius: 36px;
		width: 400px;
		max-width: 80%;
		display: flex;
		flex-flow: wrap;
		gap: 8px;
		justify-content: center;
		&.loss:after {
			content: 'You lost!';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: #000a;
			font: bold 55pt Arial;
			color: white;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	button {
		font: 20pt Helvetica Neue;
	}

	.dev-info {
		position: fixed;
		bottom: 0;
		left: 0;
		background: #0004;
		color: white;
		font: 10pt monospace;
		text-align: left;
		max-width: 200px;
		max-height: 100px;
		overflow: auto;
		& div {
			margin: 3px;
		}
	}
</style>
