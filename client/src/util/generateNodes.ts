import { ReactNode } from 'react';

export function generateNodes(count: number, factory: (index: number) => ReactNode) {
	return Array.from({ length: count }, (_, index) => factory(index));
}