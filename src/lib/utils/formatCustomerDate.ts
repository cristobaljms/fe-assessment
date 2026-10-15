const customerDateFormatter = new Intl.DateTimeFormat('es-ES', {
	day: '2-digit',
	month: 'short',
	year: 'numeric'
});

export function formatCustomerDate(value: string): string {
	return customerDateFormatter.format(new Date(value));
}