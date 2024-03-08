import { ResponsiveSvg } from './ResponsiveSvg.tsx';
import { ReactNode, SVGProps, useMemo } from 'react';
import { ChartGroups } from './ChartGroups.tsx';
import { useChartColors } from './useChartColors.ts';
import { ChartPoints } from './ChartPoints.tsx';
import { ChartYAxis } from './ChartYAxis.tsx';

export type ChartProps<TNode> = {
	nodes: Array<TNode>;
	getValue: (node: TNode) => number;
	getGroup: (node: TNode) => string;
	getTooltip: (node: TNode) => ReactNode;
} & Omit<SVGProps<SVGSVGElement>, 'children'>;

export const Chart = <TNode,>(props: ChartProps<TNode>) => {
	const { nodes, getValue, getGroup, getTooltip, ...svgProps } = props;

	const { getColorById } = useChartColors();

	const nodeValues = useMemo(() => nodes.map(getValue), [nodes, getValue]);
	const nodeGroups = useMemo(() => nodes.map(getGroup), [nodes, getGroup]);

	const range = useMemo(() => {
		let min = Math.min(...nodeValues);
		let max = Math.max(...nodeValues);

		const margin = (max - min) * 0.1;

		min -= margin;
		max += margin;

		if (min < 0) {
			min = 0;
		}

		if (max > 10) {
			max = 10;
		}

		return [min, max] as [number, number];
	}, [nodeValues]);

	return (
		<ResponsiveSvg {...svgProps}>
			{
				(width, height) => (<>
					<ChartGroups
						width={width}
						height={height}
						nodeGroups={nodeGroups}
						getColorById={getColorById}>
					</ChartGroups>
					<ChartYAxis
						width={width}
						height={height}
						range={range}/>
					<ChartPoints
						values={nodeValues}
						groups={nodeGroups}
						nodes={props.nodes}
						range={range}
						width={width}
						height={height}
						getColorById={getColorById}
						getTooltip={getTooltip}/>
				</>)
			}
		</ResponsiveSvg>
	)
}