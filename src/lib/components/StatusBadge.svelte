<script lang="ts">
	import { STATUS_META } from '#lib/constants/customerStatus.js';
	import type { CustomerStatus } from '#lib/types/customer.js';

	let { status }: { status: CustomerStatus } = $props();
	let meta = $derived(STATUS_META[status]);
</script>

<span
	class={`inline-flex h-7 min-w-24 items-center gap-2 rounded-full border px-2.5 text-xs font-semibold ${meta.badgeClass}`}
	title={meta.description}
>
	<span class={`size-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true"></span>
	{meta.label}
</span>