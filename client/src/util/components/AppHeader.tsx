import { ReactNode } from 'react';
import { Hr } from './Hr.tsx';

export interface AppHeaderProps {
	children: ReactNode;
	left?: ReactNode;
	right?: ReactNode;
}

export const AppHeader = (props: AppHeaderProps) => {
	return (
		<>
			<div className='w-full flex items-center justify-between py-2'>
				<div className='flex items-center'>
					{props.left}
				</div>
				<div className='flex-grow flex justify-center items-center'>
					{props.children}
				</div>
				<div className='flex items-center'>
					{props.right}
				</div>
			</div>
			<Hr />
		</>
	)
}