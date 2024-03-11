import { HTMLAttributes } from 'react';

export type ToggleProps = {
	value: boolean;
	onChange: (value: boolean) => void;
	children?: React.ReactNode;
} & Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'>;

export const Toggle = (props: ToggleProps) => {
	const { value, onChange, className, ...rest } = props;

	const mergedClasses = 'cursor-pointer mb-2 block ' + (className ?? '');

	return (
		<label className={mergedClasses} {...rest}>
			<input
				className='hidden'
				type="checkbox"
				checked={value}
				onChange={(e) => onChange(e.target.checked)}
			/>
			<span className="inline-flex p-0.5 border-border border mr-1">
				<span className={`w-3 h-3 ${ props.value ? 'bg-transparent' : 'bg-backgroundDark'}`} />
				<span className={`w-3 h-3 ${ props.value ? 'bg-primary' : 'bg-transparent'}`} />
			</span>
			{props.children}
		</label>
	)
}
