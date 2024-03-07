import { ReactNode, useEffect } from 'react';
import { useTooltipService } from './TooltipProvider.tsx';

export interface TooltipProps {
	content: ReactNode;
	children: ReactNode;
}

export const Tooltip = (props: TooltipProps) => {
	const tooltipService = useTooltipService();

	const showTooltip = (e: React.MouseEvent<HTMLElement>) => {
		tooltipService.showTooltip(props.content, e.currentTarget);
	}

	const hideTooltip = () => {
		tooltipService.hideTooltip();
	}
	
	useEffect(() => {
		return () => tooltipService.hideTooltip();
	}, [])

	return (
		<div className='contents relative' onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
			{props.children}
		</div>
	)
}
