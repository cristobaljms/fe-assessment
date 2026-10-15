<script lang="ts">
	import { Eye } from '@lucide/svelte';
	import CustomerListItem from './CustomerListItem.svelte';
	import StatusBadge from './StatusBadge.svelte';
	import type { Customer } from '#lib/types/customer.js';
	import { formatCustomerDate } from '#lib/utils/formatCustomerDate.js';

	interface Props {
		customers: Customer[];
		onView: (customer: Customer) => void;
	}

	let { customers, onView }: Props = $props();
</script>

<div class="hidden overflow-x-auto md:block">
	<table class="w-full border-collapse text-left">
		<caption class="sr-only">Lista de clientes registrados</caption>
		<thead>
			<tr class="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
				<th scope="col" class="px-5 py-3.5">Cliente</th>
				<th scope="col" class="px-5 py-3.5">Estado</th>
				<th scope="col" class="px-5 py-3.5">Fecha de registro</th>
				<th scope="col" class="px-5 py-3.5 text-right">Acción</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-slate-200">
			{#each customers as customer (customer.id)}
				<tr class="group hover:bg-slate-50/70">
					<td class="px-5 py-4">
						<p class="font-semibold text-slate-950">{customer.name}</p>
						<p class="mt-0.5 text-sm text-slate-600">{customer.email}</p>
					</td>
					<td class="px-5 py-4"><StatusBadge status={customer.status} /></td>
					<td class="px-5 py-4 text-sm text-slate-600">{formatCustomerDate(customer.created_at)}</td>
					<td class="px-5 py-4 text-right">
						<button
							type="button"
							onclick={() => onView(customer)}
							class="inline-flex h-9 items-center gap-2 rounded px-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-700"
						>
							<Eye class="size-4" aria-hidden="true" />
							Ver detalle
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<ul class="md:hidden">
	{#each customers as customer (customer.id)}
		<CustomerListItem {customer} {onView} />
	{/each}
</ul>