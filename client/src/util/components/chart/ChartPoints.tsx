import { GroupHandlesHeight, TopMargin, YAxisWidth } from './layout-constants.ts';
import { lerp } from '../../math/lerp.ts';
import { ChartColor } from './useChartColors.ts';
import { ReactNode } from 'react';
import { TooltipCustomized } from '../tooltip';

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

	let left = YAxisWidth;
	let right = props.width;
	const bottom = props.height - GroupHandlesHeight;
	const top = TopMargin;

	const rangeOfOneNode = Math.max((right - left) / props.values.length, 0);
	const halfRangeOfOneNode = rangeOfOneNode / 2;

	left += halfRangeOfOneNode;
	right -= halfRangeOfOneNode;

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
						<TooltipCustomized content={props.getTooltip(node)} key={index}>
							{
								(showTooltip, hideTooltip, target) => (
									<g key={index} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} className='group'>
										<rect x={dotX - halfRangeOfOneNode} width={rangeOfOneNode} y={TopMargin} height={Math.max(props.height - GroupHandlesHeight - TopMargin, 0)} className='fill-transparent hover:fill-black opacity-10'/>
										<circle ref={target as any} cx={dotX} cy={dotY} r={5} className={`${color.fillClass} ${color.hoverClass} group-hover:stroke-textSubtle stroke-2`}></circle>
									</g>
								)
							}
						</TooltipCustomized>
					)
				})
			}
		</g>
	)
}