import { ReactNode, SVGProps, useEffect, useRef, useState } from 'react';

type ResponsiveSvgProps = {
	children: (width: number, height: number) => ReactNode;
} & Omit<SVGProps<SVGSVGElement>, 'children'>;

export const ResponsiveSvg = ({ children, ...props }: ResponsiveSvgProps) => {
	const [size, setSize] = useState({ width: 0, height: 0 });
	const ref = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const handleResize = () => {
			if (ref.current) {
				const { width, height } = ref.current.getBoundingClientRect();
				setSize({ width, height });
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<svg ref={ref} viewBox={`0 0 ${size.width} ${size.height}`} {...props}>
			{children(size.width, size.height)}
		</svg>
	);
};