import { json } from '@sveltejs/kit';
import { customers } from '#lib/data/customers.server.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
	const customerId = Number(params.id);
	const customer = Number.isInteger(customerId)
		? customers.find((item) => item.id === customerId)
		: undefined;

	if (!customer) {
		return json({ error: 'No encontramos el cliente solicitado.' }, { status: 404 });
	}

	return json(customer);
};