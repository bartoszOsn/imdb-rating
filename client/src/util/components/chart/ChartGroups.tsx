import { Fragment, useMemo } from 'react';
import { ChartColor } from './useChartColors.ts';
import { GroupHandlesHeight, YAxisWidth } from './layout-constants.ts';

export interface ChartGroupsProps {
	width: number;
	height: number;
	nodeGroups: Array<string>;
	getColorById: (id: string | number) => ChartColor;
}

export const ChartGroups = ({ width, height, nodeGroups, getColorById }: ChartGroupsProps) => {
	const actualWidth = width - YAxisWidth;

	const groups: Array<GroupBlock> = useMemo(() => groupsToBlocks(nodeGroups), [nodeGroups]);

	return (
		<g>
			{
				groups.map((group) => {
					const widthPerNode = actualWidth / nodeGroups.length;

					const x = Math.floor(group.firstNodeIndex * widthPerNode) + YAxisWidth;
					const y = 0;
					const w = Math.max(Math.ceil(group.numberOfNodes * widthPerNode), 0);
					const h = height;
					const color = getColorById(group.name);

					return (
						<Fragment key={group.name}>
							<rect
								x={x}
								y={y}
								width={w}
								height={h}
								className={color.fillSubtleClass}
							/>
							<rect
								x={x}
								y={height - GroupHandlesHeight}
								width={w}
								height={GroupHandlesHeight}
								className={`${color.fillClass} ${color.hoverClass} cursor-pointer`}
							/>
						</Fragment>
					);
				})
			}
		</g>
	);
}

interface GroupBlock {
	firstNodeIndex: number;
	numberOfNodes: number;
	name: string;
}

function groupsToBlocks(nodeGroups: Array<string>): Array<GroupBlock> {
	const blocks: Array<GroupBlock> = [];
	let currentBlock: GroupBlock = {
		firstNodeIndex: 0,
		numberOfNodes: 1,
		name: nodeGroups[0]
	};

	for (let i = 1; i < nodeGroups.length; i++) {
		if (nodeGroups[i] === currentBlock.name) {
			currentBlock.numberOfNodes++;
		} else {
			blocks.push(currentBlock);
			currentBlock = {
				firstNodeIndex: i,
				numberOfNodes: 1,
				name: nodeGroups[i]
			};
		}
	}

	blocks.push(currentBlock);
	return blocks;
}