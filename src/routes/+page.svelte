<script lang="ts">
	import { onMount } from 'svelte';
	import { CircleAlert, RefreshCw, UsersRound } from '@lucide/svelte';
	import { getCustomers } from '#lib/api/customers.js';
	import CustomerDetail from '#lib/components/CustomerDetail.svelte';
	import CustomerFilters from '#lib/components/CustomerFilters.svelte';
	import CustomerList from '#lib/components/CustomerList.svelte';
	import type { Customer, CustomerStatusFilter } from '#lib/types/customer.js';
	import { filterCustomers } from '#lib/utils/filterCustomers.js';

	let customers = $state<Customer[]>([]);
	let loading = $state(true);
	let errorMessage = $state<string | null>(null);
	let search = $state('');
	let status = $state<CustomerStatusFilter>('ALL');
	let selectedCustomer = $state<Customer | null>(null);
	let activeController: AbortController | null = null;

	let visibleCustomers = $derived(filterCustomers(customers, { search, status }));
	let hasActiveFilters = $derived(search.trim().length > 0 || status !== 'ALL');
	let statusCounts = $derived({
		ACTIVE: customers.filter((customer) => customer.status === 'ACTIVE').length,
		PENDING: customers.filter((customer) => customer.status === 'PENDING').length,
		BLOCKED: customers.filter((customer) => customer.status === 'BLOCKED').length
	});

	async function loadCustomers() {
		activeController?.abort();
		const controller = new AbortController();
		activeController = controller;
		loading = true;
		errorMessage = null;

		try {
			customers = await getCustomers(fetch, { signal: controller.signal });
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			errorMessage = error instanceof Error ? error.message : 'No pudimos cargar los clientes.';
		} finally {
			if (activeController === controller) loading = false;
		}
	}

	function clearFilters() {
		search = '';
		status = 'ALL';
	}

	onMount(() => {
		void loadCustomers();
		return () => activeController?.abort();
	});
</script>

<svelte:head>
	<title>Customer Dashboard</title>
	<meta
		name="description"
		content="Panel operativo para consultar, filtrar y revisar el estado de clientes."
	/>
</svelte:head>

<div class="min-h-screen text-slate-900">
	<header class="border-b border-emerald-950/40 bg-[#12372d] text-white">
		<div class="mx-auto flex min-h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<div class="grid size-9 place-items-center rounded-md bg-[#d8f06a] text-[#12372d]">
					<UsersRound class="size-5" strokeWidth={2.2} aria-hidden="true" />
				</div>
				<div>
					<p class="text-sm font-semibold leading-tight">Customer Operations</p>
					<p class="text-xs text-emerald-100/70">Administración de clientes</p>
				</div>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8">
		<section aria-labelledby="page-title" class="mb-7">
			<div>
				<h1 id="page-title" class="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
					Customer Dashboard
				</h1>
				<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
					Consulta el estado de cada cliente y encuentra registros por nombre o correo.
				</p>
			</div>
		</section>

		<section
			aria-label="Resumen de clientes"
			class="mb-6 grid grid-cols-2 divide-x divide-y divide-slate-300 border-y border-slate-300 bg-white/60 sm:grid-cols-4 sm:divide-y-0"
		>
			<div class="px-4 py-4 sm:px-5">
				<p class="text-xs font-medium text-slate-500">Total</p>
				<p class="mt-1 text-xl font-semibold text-slate-950">{customers.length}</p>
			</div>
			<div class="px-4 py-4 sm:px-5">
				<p class="flex items-center gap-2 text-xs font-medium text-slate-500">
					<span class="size-2 rounded-full bg-emerald-600" aria-hidden="true"></span> Activos
				</p>
				<p class="mt-1 text-xl font-semibold text-slate-950">{statusCounts.ACTIVE}</p>
			</div>
			<div class="px-4 py-4 sm:px-5">
				<p class="flex items-center gap-2 text-xs font-medium text-slate-500">
					<span class="size-2 rounded-full bg-amber-500" aria-hidden="true"></span> Pendientes
				</p>
				<p class="mt-1 text-xl font-semibold text-slate-950">{statusCounts.PENDING}</p>
			</div>
			<div class="px-4 py-4 sm:px-5">
				<p class="flex items-center gap-2 text-xs font-medium text-slate-500">
					<span class="size-2 rounded-full bg-red-600" aria-hidden="true"></span> Bloqueados
				</p>
				<p class="mt-1 text-xl font-semibold text-slate-950">{statusCounts.BLOCKED}</p>
			</div>
		</section>

		<section aria-labelledby="directory-title" class="overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
			<header class="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-5">
				<div>
					<h2 id="directory-title" class="font-semibold text-slate-950">Directorio de clientes</h2>
					<p class="mt-0.5 text-xs text-slate-500">Registros disponibles en la API</p>
				</div>
				{#if !loading && !errorMessage}
					<p class="text-sm font-medium text-slate-600" aria-live="polite">
						{visibleCustomers.length} {visibleCustomers.length === 1 ? 'resultado' : 'resultados'}
					</p>
				{/if}
			</header>

			<CustomerFilters
				{search}
				{status}
				onSearchChange={(value) => (search = value)}
				onStatusChange={(value) => (status = value)}
			/>

			<div class="min-h-[28rem]">
				{#if loading}
					<div class="p-5" role="status" aria-label="Cargando clientes">
						<div class="mb-5 h-4 w-40 animate-pulse rounded bg-slate-200"></div>
						<div class="space-y-3">
							{#each Array(6) as _}
								<div class="grid h-16 animate-pulse grid-cols-[2fr_1fr_1fr] items-center gap-6 border-b border-slate-100">
									<div class="space-y-2">
										<div class="h-3 w-36 rounded bg-slate-200"></div>
										<div class="h-2.5 w-52 max-w-full rounded bg-slate-100"></div>
									</div>
									<div class="h-7 w-24 rounded-full bg-slate-100"></div>
									<div class="h-3 w-24 rounded bg-slate-100"></div>
								</div>
							{/each}
						</div>
						<span class="sr-only">Cargando clientes…</span>
					</div>
				{:else if errorMessage}
					<div class="grid min-h-[28rem] place-items-center p-6 text-center" role="alert">
						<div class="max-w-sm">
							<div class="mx-auto grid size-11 place-items-center rounded-md bg-red-50 text-red-700">
								<CircleAlert class="size-5" aria-hidden="true" />
							</div>
							<h3 class="mt-4 font-semibold text-slate-950">No pudimos cargar los clientes</h3>
							<p class="mt-2 text-sm leading-6 text-slate-600">{errorMessage}</p>
							<button
								type="button"
								onclick={loadCustomers}
								class="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-[#176b57] px-4 text-sm font-semibold text-white hover:bg-[#125846] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
							>
								<RefreshCw class="size-4" aria-hidden="true" />
								Reintentar
							</button>
						</div>
					</div>
				{:else if customers.length === 0}
					<div class="grid min-h-[28rem] place-items-center p-6 text-center">
						<div class="max-w-sm">
							<UsersRound class="mx-auto size-9 text-slate-400" aria-hidden="true" />
							<h3 class="mt-4 font-semibold text-slate-950">Aún no hay clientes registrados</h3>
							<p class="mt-2 text-sm text-slate-600">Los nuevos registros aparecerán en este directorio.</p>
						</div>
					</div>
				{:else if visibleCustomers.length === 0}
					<div class="grid min-h-[28rem] place-items-center p-6 text-center">
						<div class="max-w-sm">
							<h3 class="font-semibold text-slate-950">No hay coincidencias</h3>
							<p class="mt-2 text-sm leading-6 text-slate-600">
								Prueba con otro nombre, correo o estado.
							</p>
							{#if hasActiveFilters}
								<button
									type="button"
									onclick={clearFilters}
									class="mt-4 h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
								>
									Limpiar filtros
								</button>
							{/if}
						</div>
					</div>
				{:else}
					<CustomerList customers={visibleCustomers} onView={(customer) => (selectedCustomer = customer)} />
				{/if}
			</div>
		</section>
	</main>
</div>

<CustomerDetail customer={selectedCustomer} onClose={() => (selectedCustomer = null)} />
