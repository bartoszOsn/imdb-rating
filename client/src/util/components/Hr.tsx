import { ComponentProps } from 'react';

export const Hr = (props: ComponentProps<'hr'>) => (
	<hr {...props} className={`${props.className ?? ''} w-full m-0 border-border`} />
)