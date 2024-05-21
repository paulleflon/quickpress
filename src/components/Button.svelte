<script>
	import { createEventDispatcher } from 'svelte';

	export let data;
	export let tabindex;

	const dispatch = createEventDispatcher();

	const keydown = (e) => {
		if (e.key === data.key) dispatch('pressed');
	};
</script>

<svelte:window on:keydown={keydown} />

<div
	class={`${data.isCurrentGoal ? 'goal' : ''} ${data.pressed ? 'pressed' : ''}`}
	on:mousedown={() => dispatch('pressed')}
	role="button"
	{tabindex}
>
	{#if data.key}
		<span>{data.key.toUpperCase()}</span>
	{/if}
	{#if data.index !== undefined && !data.pressed}
		<span>{data.index + 1}</span>
	{/if}
</div>

<style>
	div {
		position: relative;
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

		& span + span {
			position: absolute;
			background: #eee;
			width: 23px;
			height: 23px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			top: -5px;
			right: 0;
		}

		&.goal {
			background: #da4747;
		}

		&.goal.pressed {
			background: #eee;
		}
	}
</style>
