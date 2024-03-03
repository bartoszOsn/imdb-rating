import styled from 'styled-components';
import { size } from '../styles.ts';

export const AppLayout = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${size(2)};
	padding: ${size(2)};
`;
