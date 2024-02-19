export function parseNumberOrElse(value: string, defaultValue: number): number {
	const parsed = parseFloat(value);
	return isNaN(parsed) ? defaultValue : parsed;
}