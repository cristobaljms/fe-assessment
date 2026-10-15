export const CUSTOMER_STATUSES = ['ACTIVE', 'PENDING', 'BLOCKED'] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];
export type CustomerStatusFilter = CustomerStatus | 'ALL';

export interface Customer {
	id: number;
	name: string;
	email: string;
	status: CustomerStatus;
	created_at: string;
}

export function isCustomerStatus(value: string): value is CustomerStatus {
	return CUSTOMER_STATUSES.some((status) => status === value);
}