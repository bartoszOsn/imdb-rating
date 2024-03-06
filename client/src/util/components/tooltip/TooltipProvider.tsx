import { createContext, ReactNode, useContext, } from 'react';
import { TooltipService, useCreateTooltipService } from './TooltipService.tsx';

export interface TooltipProviderProps {
	children: ReactNode;
}

const TooltipServiceContext = createContext<TooltipService>(null as unknown as TooltipService);

export const TooltipProvider = (props: TooltipProviderProps) => {
	const tooltipService = useCreateTooltipService();

	return (
		<TooltipServiceContext.Provider value={tooltipService}>
			{props.children}
			{tooltipService.getTooltip()}
		</TooltipServiceContext.Provider>
	)
}

export const useTooltipService = () => {
	return useContext(TooltipServiceContext);
}