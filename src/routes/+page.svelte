<script>
	import { dev } from '$app/environment';
	import { initButtons } from '$lib/ButtonData.js';
	import Keyboard from '../components/Keyboard.svelte';

	let gameData = {
		status: 'idle',
		score: 0,
		bestScore: 0,
		timeout: 0,
		roundCount: 0,
		pressesThisRound: 0
	};
	let gameRules = {
		timer: true,
		ordered: false,
		roundDuration: 3000,
		pressesPerRound: 6
	};

	let startTimerAnimation; /* Allows to trigger Keyboard's timer animation from Parent */
	let keys = initButtons();

	const startGame = () => {
		keys = initButtons();
		gameData.status = 'playing';
		gameData.score = 0;
		gameData.roundCount = 0;
		startRound();
	};

	export const startRound = () => {
		gameData.roundCount++;
		const goals = new Array(16).fill(false);
		const indexes = new Array(16).fill(undefined);
		for (let i = 0; i < gameRules.pressesPerRound; ) {
			let index = Math.floor(Math.random() * 16);
			if (!goals[index]) {
				goals[index] = true;
				if (gameRules.ordered) {
					let j;
					do {
						j = Math.floor(Math.random() * gameRules.pressesPerRound);
					} while (indexes.includes(j));
					indexes[index] = j;
				}
				i++;
			}
			if (gameRules.timer) startTimerAnimation();
		}

		for (const i in keys) {
			keys[i].step(goals[i], indexes[i]);
		}
		keys = keys;
		if (gameRules.timer) {
			clearTimeout(gameData.timeout);
			gameData.timeout = setTimeout(lose, gameRules.roundDuration);
		}
	};

	const lose = () => {
		gameData.status = 'idle';
		gameData.score = 0;
		gameData.pressesThisRound = 0;
		if (gameRules.timer) clearTimeout(gameData.timeout);
	};
</script>

<header>quickpress</header>
<div class="game-container">
	<div class="scores">
		<div>{gameData.score}</div>
		<div>{gameData.bestScore}</div>
	</div>
	<Keyboard
		{keys}
		bind:gameRules
		bind:gameData
		on:lose={lose}
		on:roundEnd={startRound}
		bind:startTimerAnimation
	/>
</div>
<button on:click={startGame} disabled={gameData.status === 'playing'}>Play</button>
<input
	type="checkbox"
	bind:checked={gameRules.ordered}
	disabled={gameData.status === 'playing'}
	id="ordered"
/>
<label for="ordered">Enable ordered presses</label>
<input
	type="checkbox"
	bind:checked={gameRules.timer}
	disabled={gameData.status === 'playing'}
	id="timed"
/>
<label for="timed">Enable timed presses</label>
{#if dev}
	<div class="dev-info">
		<!-- svelte-ignore missing-declaration -->
		<div>{PKG.name} - {PKG.version}</div>
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
