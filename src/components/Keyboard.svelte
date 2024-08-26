<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from './Button.svelte';
	export let gameData;
	export let gameRules;
	export let keys;
	const dispatch = createEventDispatcher();

	let lost = false;


	/* Timer rendering */
	let timerLine;
	let timerAnimation;
	onMount(() => {
		const x = timerLine.getTotalLength();
		timerLine.style.strokeDasharray = x + 'px';
		timerLine.style.strokeDashoffset = 0;
		timerAnimation = new Animation(
			new KeyframeEffect(timerLine, [{ strokeDashoffset: x + 'px' }], {
				duration: gameRules.roundDuration,
			})
		);
	});

	/* I/O handling */
	const onKeyDown = (e) => {
		if (gameData.status === 'idle') return;
		const k = e.key;
		// We let the player tap on function keys without losing
		if (['Meta', 'Control', 'Alt', 'Tab', ' ', 'Shift'].includes(k)) return;
		if (keys.every((btn) => btn.key !== k)) lose();
	};

	const onPress = (i) => {
		if (gameData.status === 'idle') return;

		if (!keys[i].isCurrentGoal || keys[i].pressed) return lose();
		if (gameRules.ordered && keys[i].index !== gameData.pressesThisRound) return lose();
		keys[i].pressed = true;
		gameData.pressesThisRound++;
		gameData.score++;
		if (gameData.score > gameData.best) gameData.best = gameData.score;
		if (gameData.pressesThisRound === gameRules.pressesPerRound) {
			dispatch('roundEnd');
			gameData.pressesThisRound = 0;
			timerAnimation.cancel();
			timerAnimation.play();
		}
	};

	const lose = () => {
		gameData.pressesThisRound = 0;
		timerAnimation.cancel();
		dispatch('lose');
	}

	export const startTimerAnimation = () => {
		timerAnimation.cancel();
		timerAnimation.play();
	}


</script>

<svelte:window on:keydown={onKeyDown} />

<div class="kb">
	<div class={`overlay ${gameData.status !== 'playing' ? 'visible' : ''}`}>
		Game over! Play again?
	</div>
	<svg width="100%" height="100%">
		<rect bind:this={timerLine} width="100%" height="100%" />
	</svg>
	{#if gameData.status === 'playing'}
		{#each keys as data, index}
			<Button bind:data index on:pressed={() => onPress(index)} />
		{/each}
	{/if}
</div>

<style>
	.kb {
		position: relative;
		overflow: hidden;
		padding: 20px;
		border-radius: 20px;
		width: 400px;
		height: 200px;
		max-width: 80%;
		display: flex;
		flex-flow: wrap;
		gap: 8px;
		justify-content: center;
		& .overlay {
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 1000;
			top: 5px;
			left: 5px;
			right: 5px;
			bottom: 5px;
			border-radius: 15px;
			background: #0008;
			color: white;
			font: 50pt Arial;
			opacity: 0;
			pointer-events: none;
			transition: opacity .3s ease, backdrop-filter .3s ease;
			&.visible {
				opacity: 1;
				backdrop-filter: blur(15px);
			}
		}
		& svg {
			top: 0;
			position: absolute;
			& rect {
				stroke: #0080ff;
				fill: #24252f;
				stroke-width: 10px;
				rx: 20px;
				ry: 20px;
			}
		}
	}
</style>
