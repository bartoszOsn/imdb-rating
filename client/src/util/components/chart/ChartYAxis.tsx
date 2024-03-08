import { inverseLerp } from '../../math/inverseLerp.ts';
import { lerp } from '../../math/lerp.ts';
import { GroupHandlesHeight, TopMargin, YAxisWidth } from './layout-constants.ts';

export interface ChartYAxisProps {
	width: number;
	height: number;
	range: [number, number];
}

export const ChartYAxis = (props: ChartYAxisProps) => {
	const lines = getLines(props.range);

	return (
		<g>
			{
				lines.map((line, index) => {
					const yFrag = inverseLerp(props.range[0], props.range[1], line)
					const y = Math.floor(lerp(props.height - GroupHandlesHeight, TopMargin, yFrag));
					return (
						<>
							<text
								key={index}
								x={0}
								y={y}
								className="fill-text"
								dominantBaseline="middle">
								{line}
							</text>
							<line
								key={index}
								x1={YAxisWidth}
								y1={y}
								x2={props.width}
								y2={y}
								className="stroke-textSubtle stroke-1 opacity-50 dasharray" />
						</>
					)
				})
			}
		</g>
	)
}

function getLines(range: [number, number]): Array<number> {
	const lines: Array<number> = [];
	for (let i = Math.ceil(range[0]); i <= range[1]; i++) {
		lines.push(i);
	}
	return lines;
}