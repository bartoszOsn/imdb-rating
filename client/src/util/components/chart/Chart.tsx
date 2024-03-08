import { ResponsiveSvg } from './ResponsiveSvg.tsx';
import { ReactNode, SVGProps, useMemo } from 'react';
import { ChartGroups } from './ChartGroups.tsx';
import { useChartColors } from './useChartColors.ts';
import { ChartPoints } from './ChartPoints.tsx';

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
					<ChartPoints
						values={nodeValues}
						groups={nodeGroups}
						nodes={props.nodes}
						range={[5, 10]}
						width={width}
						height={height}
						getColorById={getColorById}
						getTooltip={getTooltip}/>
				</>)
			}
		</ResponsiveSvg>
	)
}