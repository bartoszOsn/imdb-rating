export class ExhaustError extends Error {
	constructor(value: never) {
		super(`Exhausted all possibilities, got: ${value}`);
	}
}