import { ReactNode, Ref, useEffect, useRef } from 'react';
import { useTooltipService } from './TooltipProvider.tsx';

export interface TooltipCustomizedProps {
	content: ReactNode;
	children: (showTooltip: () => void, hideTooltip: () => void, target: Ref<HTMLElement | SVGElement | null>) => ReactNode;
}

export const TooltipCustomized = (props: TooltipCustomizedProps) => {
	const ref = useRef<HTMLElement | SVGElement>(null);
	const tooltipService = useTooltipService();

	const showTooltip = () => {
		ref.current && tooltipService.showTooltip(props.content, ref.current);
	}

	const hideTooltip = () => {
		tooltipService.hideTooltip();
	}

	useEffect(() => {
		return () => tooltipService.hideTooltip();
	}, [])

	return props.children(showTooltip, hideTooltip, ref);
}
