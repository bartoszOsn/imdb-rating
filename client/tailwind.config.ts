import type { Config } from 'tailwindcss'
// @ts-ignore
import { default as Color } from 'color';

export const colors = (() => {
	const background = new Color('#f5f5f5');
	const text = new Color('#04030F');
	const textSubtle = new Color('#a8a6b0');
	const danger = new Color('#AD343E');
	const warning = new Color('#F9C22E');
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
		warning: warning.toString(),
		success: success.toString(),
		primary: primary.toString(),
		border: border.toString(),
		transparent: transparent.toString(),
		scale: {
			'0': danger.toString(),
			'1':danger.mix(warning, 0.2).toString(),
			'2':danger.mix(warning, 0.4).toString(),
			'3':danger.mix(warning, 0.6).toString(),
			'4':danger.mix(warning, 0.8).toString(),
			'5':warning.toString(),
			'6':warning.mix(success, 0.2).toString(),
			'7':warning.mix(success, 0.4).toString(),
			'8':warning.mix(success, 0.6).toString(),
			'9':warning.mix(success, 0.8).toString(),
			'10':success.toString(),
		}
	} as const;
})();

export default {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./index.html',
	],
	theme: {
		extend: {
			colors
		},
		zIndex: {
			default: '0',
			elevated: '10',
			'elevated-plus': '15',
			overlay: '20',
			tooltip: '30'
		},
		fontSize: {
			xs: '10px',
			small: '12px',
			medium: '16px',
			large: '20px',
			xl: '24px',
			'2xl': '32px'
		}
	},
	plugins: [],
} satisfies Config

