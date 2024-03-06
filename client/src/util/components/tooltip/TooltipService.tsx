import { ReactNode, useState } from 'react';
import { TooltipOverlay } from './TooltipOverlay.tsx';

export function useCreateTooltipService() {
	const [tooltipConfig, setTooltipConfig] = useState<TooltipConfig | null>(null);

	const showTooltip = (content: ReactNode, target: HTMLElement) => {
		setTooltipConfig({
			content,
			target
		});
	}

	const hideTooltip = () => {
		setTooltipConfig(null);
	}

	const getTooltip = () => {
		if (!tooltipConfig) {
			return null;
		}

		return (
			<TooltipOverlay target={tooltipConfig.target}>
				{tooltipConfig.content}
			</TooltipOverlay>
		)
	}

	return {
		showTooltip,
		hideTooltip,
		getTooltip
	};

}

export interface TooltipService {
	showTooltip(content: ReactNode, target: HTMLElement): void;

	hideTooltip(): void;

	getTooltip(): ReactNode;
}

interface TooltipConfig {
	content: ReactNode;
	target: HTMLElement;
}