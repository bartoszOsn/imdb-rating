import { ReactNode, useEffect, useRef, useState } from 'react';
import { TooltipPosition } from './TooltipPosition.ts';

export interface TooltipOverlayProps {
	children: ReactNode;
	target: HTMLElement;
}

const TOOLTIP_OFFSET = 8;

export const TooltipOverlay = (props: TooltipOverlayProps) => {
	const overlayRef = useRef<HTMLDivElement | null>(null);
	const [position, setPosition] = useState<TooltipPosition>({top: 0, left: 0});

	useEffect(() => {
		setPosition(calculatePosition(props.target, overlayRef.current));
	}, [props.target]);

	return (
		<div ref={overlayRef} className="absolute z-tooltip bg-background border border-border p-2 shadow-md"
			style={{top: position.top, left: position.left}}
		>
			{props.children}
		</div>
	)
}

function calculatePosition(target: HTMLElement, overlay: HTMLElement | null): TooltipPosition {
	const targetRect = getContentsElementRect(target);
	const overlayRect = overlay ? overlay.getBoundingClientRect() : new DOMRect(0, 0, 0, 0);

	let top = targetRect.top - overlayRect.height - TOOLTIP_OFFSET;
	let left = targetRect.left + targetRect.width / 2 - overlayRect.width / 2;

	if (top < 0) {
		top = targetRect.bottom + TOOLTIP_OFFSET;
	}

	if (left < 0) {
		left = 0;
	} else if (left + overlayRect.width > window.innerWidth) {
		left = window.innerWidth - overlayRect.width;
	}

	return {
		top: top,
		left: left
	}
}

function getContentsElementRect(contentsElement: HTMLElement): DOMRect {
	const children = contentsElement.children;
	const minTop = Math.min(...Array.from(children).map((child: Element) => child.getBoundingClientRect().top));
	const maxBottom = Math.max(...Array.from(children).map((child: Element) => child.getBoundingClientRect().bottom));
	const minLeft = Math.min(...Array.from(children).map((child: Element) => child.getBoundingClientRect().left));
	const maxRight = Math.max(...Array.from(children).map((child: Element) => child.getBoundingClientRect().right));

	return new DOMRect(minLeft, minTop, maxRight - minLeft, maxBottom - minTop);
}