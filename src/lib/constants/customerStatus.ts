import type { CustomerStatus, CustomerStatusFilter } from '#lib/types/customer.js';

interface StatusMeta {
	label: string;
	description: string;
	badgeClass: string;
	dotClass: string;
}

export const STATUS_META: Record<CustomerStatus, StatusMeta> = {
	ACTIVE: {
		label: 'Activo',
		description: 'Cliente habilitado',
		badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
		dotClass: 'bg-emerald-600'
	},
	PENDING: {
		label: 'Pendiente',
		description: 'Revisión pendiente',
		badgeClass: 'border-amber-200 bg-amber-50 text-amber-900',
		dotClass: 'bg-amber-500'
	},
	BLOCKED: {
		label: 'Bloqueado',
		description: 'Acceso restringido',
		badgeClass: 'border-red-200 bg-red-50 text-red-800',
		dotClass: 'bg-red-600'
	}
};

export const STATUS_FILTERS: ReadonlyArray<{ value: CustomerStatusFilter; label: string }> = [
	{ value: 'ALL', label: 'Todos' },
	{ value: 'ACTIVE', label: 'Activos' },
	{ value: 'PENDING', label: 'Pendientes' },
	{ value: 'BLOCKED', label: 'Bloqueados' }
];