import { useRef } from 'react';

const predefinedColors: Array<ChartColor> = [
	{ fillClass: 'fill-blue-600', fillSubtleClass: 'fill-blue-100', hoverClass: 'hover:fill-blue-700' },
	{ fillClass: 'fill-orange-600', fillSubtleClass: 'fill-orange-100', hoverClass: 'hover:fill-orange-700' },
	{ fillClass: 'fill-green-600', fillSubtleClass: 'fill-green-100', hoverClass: 'hover:fill-green-700' },
	{ fillClass: 'fill-red-600', fillSubtleClass: 'fill-red-100', hoverClass: 'hover:fill-red-700' },
	{ fillClass: 'fill-purple-600', fillSubtleClass: 'fill-purple-100', hoverClass: 'hover:fill-purple-700' },
	{ fillClass: 'fill-teal-600', fillSubtleClass: 'fill-teal-100', hoverClass: 'hover:fill-teal-700' },
	{ fillClass: 'fill-pink-600', fillSubtleClass: 'fill-pink-100', hoverClass: 'hover:fill-pink-700' },
	{ fillClass: 'fill-indigo-600', fillSubtleClass: 'fill-indigo-100', hoverClass: 'hover:fill-indigo-700' },
	{ fillClass: 'fill-yellow-600', fillSubtleClass: 'fill-yellow-100', hoverClass: 'hover:fill-yellow-700' },
]

export function useChartColors() {
	const currentIndexRef = useRef(Math.floor(Math.random() * predefinedColors.length));
	const colorMapRef = useRef(new Map<number | string, ChartColor>());

	const getColorById = (id: number | string): ChartColor => {
		if (colorMapRef.current.has(id)) {
			return colorMapRef.current.get(id)!;
		}

		const color = predefinedColors[currentIndexRef.current];
		colorMapRef.current.set(id, color);
		currentIndexRef.current = (currentIndexRef.current + 1) % predefinedColors.length;

		return color;
	}

	return {
		getColorById
	};
}

export interface ChartColor {
	fillClass: string;
	hoverClass: string;
	fillSubtleClass: string;
}