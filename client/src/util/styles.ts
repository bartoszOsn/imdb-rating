import { default as Color } from 'color'
import { css } from 'styled-components';

export const Colors = (() => {
	const background = new Color('#f5f5f5');
	const text = new Color('#04030F');
	const danger = new Color('#AD343E');
	const waring = new Color('#F9C22E');
	const success = new Color('#16DB93');
	const primary = new Color('#006494');
	const border = text.mix(background, 0.6);

	return {
		background,
		text,
		danger,
		waring,
		success,
		primary,
		border
	} as const;
})();

export type Colors = typeof Colors;

export const Fonts = {
	primary: 'Arial, sans-serif',
	secondary: 'Georgia, serif'
} as const;

export const textSizes = {
	small: `10px`,
	medium: `16px`,
	large: `20px`
} as const;

export type Fonts = typeof Fonts;

export const size = (size: number) => css`${size * 4}px`;

export const zIndex = {
	default: 0,
	elevated: 1,
	overlay: 2
}