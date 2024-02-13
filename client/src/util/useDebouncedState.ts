import { useRef, useState } from 'react';

export const useDebouncedState = <S>(initialState: S, delay: number) => {
	const stateRef = useRef(initialState);
	const [state, setState] = useState(initialState);

	let timeout: number | null = null;

	function setDebouncedState(newState: S) {
		stateRef.current = newState;
		timeout && clearTimeout(timeout);
		timeout = setTimeout(() => {
			setState(stateRef.current);
		}, delay);
	}

	return [state, setDebouncedState] as const;
}