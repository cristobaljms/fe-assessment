import { json } from '@sveltejs/kit';
import { customers } from '#lib/data/customers.server.js';
import { isCustomerStatus } from '#lib/types/customer.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const status = url.searchParams.get('status');

	if (status !== null && !isCustomerStatus(status)) {
		return json({ error: 'El estado solicitado no es válido.' }, { status: 400 });
	}

	const result = status === null ? customers : customers.filter((customer) => customer.status === status);

	return json(result);
};