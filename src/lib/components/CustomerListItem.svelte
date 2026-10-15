<script lang="ts">
	import { ChevronRight, Mail } from '@lucide/svelte';
	import StatusBadge from './StatusBadge.svelte';
	import type { Customer } from '#lib/types/customer.js';
	import { formatCustomerDate } from '#lib/utils/formatCustomerDate.js';

	interface Props {
		customer: Customer;
		onView: (customer: Customer) => void;
	}

	let { customer, onView }: Props = $props();
	let initials = $derived(
		customer.name
			.split(' ')
			.slice(0, 2)
			.map((part) => part[0])
			.join('')
	);
</script>

<li class="border-b border-slate-200 p-4 last:border-b-0">
	<div class="flex items-start gap-3">
		<div
			class="grid size-10 shrink-0 place-items-center rounded-md bg-slate-900 text-xs font-semibold text-white"
			aria-hidden="true"
		>
			{initials}
		</div>
		<div class="min-w-0 flex-1">
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0">
					<p class="truncate font-semibold text-slate-950">{customer.name}</p>
					<p class="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-600">
						<Mail class="size-3.5 shrink-0" aria-hidden="true" />
						{customer.email}
					</p>
				</div>
				<StatusBadge status={customer.status} />
			</div>

			<div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
				<p class="text-xs text-slate-500">
					Registro <span class="font-medium text-slate-700">{formatCustomerDate(customer.created_at)}</span>
				</p>
				<button
					type="button"
					onclick={() => onView(customer)}
					class="inline-flex h-9 items-center gap-1 rounded px-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-700"
				>
					Ver detalle
					<ChevronRight class="size-4" aria-hidden="true" />
				</button>
			</div>
		</div>
	</div>
</li>