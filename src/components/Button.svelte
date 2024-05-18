<script>
	import { createEventDispatcher } from 'svelte';

	export let data;
	export let index;

	const dispatch = createEventDispatcher();

	const keydown = e => {
		if (e.key === data.key)
			dispatch('pressed');
	}
</script>

<svelte:window on:keydown={keydown} />

<div
	class={`${data.isCurrentGoal ? 'goal' : ''} ${data.pressed ? 'pressed' : ''}`}
	on:mousedown={() => dispatch('pressed')}
	role='button'
	tabindex={index}
>
	{#if data.key}
		<span>{data.key}</span>
	{/if}
</div>

<style>
	div {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #eee;
		cursor: pointer;

		& span {
			font: 13pt Arial;
		}

		&.goal {
			background: #da4747;
		}

		&.goal.pressed {
			background: #eee;
		}
	}
</style>