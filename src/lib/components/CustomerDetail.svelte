<script lang="ts">
	import { CalendarDays, Hash, Mail, UserRound, X } from '@lucide/svelte';
	import StatusBadge from './StatusBadge.svelte';
	import type { Customer } from '#lib/types/customer.js';
	import { formatCustomerDate } from '#lib/utils/formatCustomerDate.js';

	interface Props {
		customer: Customer | null;
		onClose: () => void;
	}

	let { customer, onClose }: Props = $props();
	let dialogElement = $state<HTMLElement | null>(null);
	let closeButton = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		if (!customer) return;

		const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		requestAnimationFrame(() => closeButton?.focus());

		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault();
				onClose();
				return;
			}

			if (event.key !== 'Tab') return;

			const focusable = dialogElement?.querySelectorAll<HTMLElement>(
				'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			);
			const first = focusable?.item(0);
			const last = focusable?.item((focusable?.length ?? 0) - 1);

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last?.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first?.focus();
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = previousOverflow;
			previousFocus?.focus();
		};
	});
</script>

{#if customer}
	<div class="fixed inset-0 z-50 grid place-items-end sm:place-items-center">
		<button
			type="button"
			tabindex="-1"
			onclick={onClose}
			class="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-[2px]"
			aria-label="Cerrar detalle"
		></button>

		<div
			bind:this={dialogElement}
			role="dialog"
			aria-modal="true"
			aria-labelledby="customer-detail-title"
			class="relative z-10 w-full max-w-lg rounded-t-lg bg-white shadow-2xl sm:mx-6 sm:rounded-lg"
		>
			<header class="flex items-start justify-between border-b border-slate-200 p-5 sm:p-6">
				<div>
					<p class="text-sm font-medium text-emerald-800">Ficha del cliente</p>
					<h2 id="customer-detail-title" class="mt-1 text-xl font-semibold text-slate-950">
						{customer.name}
					</h2>
				</div>
				<button
					bind:this={closeButton}
					type="button"
					onclick={onClose}
					class="grid size-10 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-700"
					aria-label="Cerrar detalle"
					title="Cerrar detalle"
				>
					<X class="size-5" aria-hidden="true" />
				</button>
			</header>

			<div class="p-5 sm:p-6">
				<div class="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
					<span class="text-sm font-medium text-slate-600">Estado de la cuenta</span>
					<StatusBadge status={customer.status} />
				</div>

				<dl class="grid gap-5 sm:grid-cols-2">
					<div>
						<dt class="flex items-center gap-2 text-xs font-semibold text-slate-500">
							<Hash class="size-4" aria-hidden="true" /> Identificador
						</dt>
						<dd class="mt-1.5 font-medium text-slate-950">{customer.id}</dd>
					</div>
					<div>
						<dt class="flex items-center gap-2 text-xs font-semibold text-slate-500">
							<CalendarDays class="size-4" aria-hidden="true" /> Fecha de registro
						</dt>
						<dd class="mt-1.5 font-medium text-slate-950">{formatCustomerDate(customer.created_at)}</dd>
					</div>
					<div>
						<dt class="flex items-center gap-2 text-xs font-semibold text-slate-500">
							<UserRound class="size-4" aria-hidden="true" /> Nombre completo
						</dt>
						<dd class="mt-1.5 font-medium text-slate-950">{customer.name}</dd>
					</div>
					<div class="min-w-0">
						<dt class="flex items-center gap-2 text-xs font-semibold text-slate-500">
							<Mail class="size-4" aria-hidden="true" /> Correo electrónico
						</dt>
						<dd class="mt-1.5 break-words font-medium text-slate-950">{customer.email}</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
{/if}