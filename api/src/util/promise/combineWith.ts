export function combineWith<T, U>(getter: (prevValue: T) => Promise<U>): (prevValue: T) => Promise<[T, U]> {
  return async (prevValue: T) => {
	const value = await getter(prevValue);
	return [prevValue, value];
  };
}