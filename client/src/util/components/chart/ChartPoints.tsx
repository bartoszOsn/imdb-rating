import { GroupHandlesHeight, YAxisWidth } from './layout-constants.ts';
import { lerp } from '../../math/lerp.ts';
import { ChartColor } from './useChartColors.ts';
import { ReactNode } from 'react';

export interface ChartPointsProps<TNode> {
	values: Array<number>;
	groups: Array<string>;
	nodes: Array<TNode>;
	range: [number, number];
	width: number;
	height: number;
	getColorById: (id: string | number) => ChartColor;
	getTooltip: (node: TNode) => ReactNode;
}

export const ChartPoints = <TNodes,>(props: ChartPointsProps<TNodes>) => {
	const min = props.range[0];
	const max = props.range[1];

	const left = YAxisWidth;
	const right = props.width;
	const bottom = props.height - GroupHandlesHeight;
	const top = 0;

	const rangeOfOneNode = Math.max((right - left) / props.values.length, 0);
	const halfRangeOfOneNode = rangeOfOneNode / 2;

	return (
		<g>
			{
				props.values.map((value, index) => {
					const group = props.groups[index];
					const node = props.nodes[index];

					const dotX = lerp(left, right, index / (props.values.length - 1));
					const dotY = lerp(bottom, top, (value - min) / (max - min));

					const color = props.getColorById(group);

					return (
						<g key={index}>
							<rect x={dotX - halfRangeOfOneNode} width={rangeOfOneNode} y={0} height={Math.max(props.height - YAxisWidth, 0)} fill='transparent' />
							<circle cx={dotX} cy={dotY} r={5} className={`${color.fillClass} ${color.hoverClass}`}></circle>
						</g>
					)
				})
			}
		</g>
	)
}