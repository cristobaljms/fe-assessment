<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { STATUS_FILTERS } from '#lib/constants/customerStatus.js';
	import type { CustomerStatusFilter } from '#lib/types/customer.js';

	interface Props {
		search: string;
		status: CustomerStatusFilter;
		onSearchChange: (value: string) => void;
		onStatusChange: (value: CustomerStatusFilter) => void;
	}

	let { search, status, onSearchChange, onStatusChange }: Props = $props();
</script>

<div class="grid gap-4 border-b border-slate-200 p-4 sm:p-5 lg:grid-cols-[minmax(16rem,1fr)_auto]">
	<label class="relative block">
		<span class="sr-only">Buscar por nombre o correo</span>
		<Search
			class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500"
			aria-hidden="true"
		/>
		<input
			type="search"
			value={search}
			oninput={(event) => onSearchChange(event.currentTarget.value)}
			placeholder="Buscar por nombre o correo"
			class="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
		/>
		{#if search}
			<button
				type="button"
				onclick={() => onSearchChange('')}
				class="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-700"
				aria-label="Limpiar búsqueda"
				title="Limpiar búsqueda"
			>
				<X class="size-4" aria-hidden="true" />
			</button>
		{/if}
	</label>

	<fieldset>
		<legend class="sr-only">Filtrar por estado</legend>
		<div class="grid grid-cols-2 rounded-md border border-slate-300 bg-slate-100 p-1 sm:flex">
			{#each STATUS_FILTERS as option (option.value)}
				<button
					type="button"
					onclick={() => onStatusChange(option.value)}
					aria-pressed={status === option.value}
					class={`h-9 min-w-24 rounded px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-700 ${
						status === option.value
							? 'bg-white text-slate-950 shadow-sm'
							: 'text-slate-600 hover:text-slate-950'
					}`}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</fieldset>
</div>