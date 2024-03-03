import type { Config } from 'tailwindcss'
// @ts-ignore
import { default as Color } from 'color';

export const colors = (() => {
	const background = new Color('#f5f5f5');
	const text = new Color('#04030F');
	const textSubtle = new Color('#a8a6b0');
	const danger = new Color('#AD343E');
	const waring = new Color('#F9C22E');
	const success = new Color('#16DB93');
	const primary = new Color('#006494');
	const border = text.mix(background, 0.6);
	const transparent = new Color('transparent');
	const backgroundDark = background.mix(text, 0.1);

	return {
		background: background.toString(),
		backgroundDark: backgroundDark.toString(),
		text: text.toString(),
		textSubtle: textSubtle.toString(),
		danger: danger.toString(),
		waring: waring.toString(),
		success: success.toString(),
		primary: primary.toString(),
		border: border.toString(),
		transparent: transparent.toString(),
	} as const;
})();

export default {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./index.html',
	],
	theme: {
		colors,
		zIndex: {
			default: '0',
			elevated: '10',
			'elevated-plus': '15',
			overlay: '20'
		},
		fontSize: {
			xs: '10px',
			small: '12px',
			medium: '16px',
			large: '20px'
		}
	},
	plugins: [],
} satisfies Config

