import type { Customer, CustomerStatusFilter } from '#lib/types/customer.js';

interface CustomerFilters {
	search: string;
	status: CustomerStatusFilter;
}

export function filterCustomers(customers: Customer[], filters: CustomerFilters): Customer[] {
	const normalizedSearch = filters.search.trim().toLocaleLowerCase('es');

	return customers.filter((customer) => {
		const matchesStatus = filters.status === 'ALL' || customer.status === filters.status;
		const matchesSearch =
			normalizedSearch.length === 0 ||
			customer.name.toLocaleLowerCase('es').includes(normalizedSearch) ||
			customer.email.toLocaleLowerCase('es').includes(normalizedSearch);

		return matchesStatus && matchesSearch;
	});
}