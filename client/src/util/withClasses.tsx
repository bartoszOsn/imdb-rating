import { JSX } from 'react';

export function withClasses<TElement extends keyof JSX.IntrinsicElements>(
	ElementName: TElement,
	classes: string
) {
	return (props: JSX.IntrinsicElements[TElement]) => {
		const className = (props.className ?? '') + ' ' + classes;
		// @ts-ignore
		return <ElementName {...props} className={className}>{props.children}</ElementName>;
	};
}
