import { JSX } from 'react';

export const Skeleton = (props: JSX.IntrinsicElements['div']) => {
	const className = (props.className ?? '') + ' animate-pulse bg-gray-200';
	return <div {...props} className={className}>{props.children}</div>;
}