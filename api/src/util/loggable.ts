const MESSAGE_COLOR = '#4CAF50';
const MESSAGE_CSS = `color: ${MESSAGE_COLOR}; font-weight: bold`;

export function loggable<TFunc extends (this: any, ...args: any) => any>(message: string, originalFunction: TFunc): TFunc {
	return function (this: ThisType<TFunc>,...args: Parameters<TFunc>): ReturnType<TFunc> {
		console.group(` starting %c${message}`, MESSAGE_CSS);
		const time = performance.now();
		const returnValue = originalFunction.apply(this, args);

		if (returnValue instanceof Promise) {
			return returnValue.then((result) => {
				console.log(`%c${message} completed in ${performance.now() - time}ms`, MESSAGE_CSS);
				console.groupEnd();
				return result;
			}) as ReturnType<TFunc>;
		} else {
			console.log(`%c${message} completed in ${performance.now() - time}ms`, MESSAGE_CSS);
			console.groupEnd();
			return returnValue;
		}
	} as TFunc;
}
