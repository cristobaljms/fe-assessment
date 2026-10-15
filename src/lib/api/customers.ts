import type { Customer, CustomerStatus } from '#lib/types/customer.js';

interface ApiErrorBody {
	error?: string;
}

export class ApiError extends Error {
	constructor(
		message: string,
		readonly status: number
	) {
		super(message);
		this.name = 'ApiError';
	}
}

async function parseResponse<T>(response: Response): Promise<T> {
	if (response.ok) {
		return response.json() as Promise<T>;
	}

	const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
	throw new ApiError(body.error ?? 'No se pudo completar la solicitud.', response.status);
}

export async function getCustomers(
	fetcher: typeof fetch,
	options: { status?: CustomerStatus; signal?: AbortSignal } = {}
): Promise<Customer[]> {
	const query = options.status ? `?status=${options.status}` : '';
	const response = await fetcher(`/api/customers${query}`, { signal: options.signal });
	return parseResponse<Customer[]>(response);
}

export async function getCustomer(
	fetcher: typeof fetch,
	id: number,
	signal?: AbortSignal
): Promise<Customer> {
	const response = await fetcher(`/api/customers/${id}`, { signal });
	return parseResponse<Customer>(response);
}