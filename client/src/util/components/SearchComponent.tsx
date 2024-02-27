import styled from 'styled-components';
import { Colors, size, zIndex } from '../styles.ts';
import { FormEvent, ReactNode } from 'react';

export interface SearchComponentProps {
	children?: ReactNode;
	onInput?: (query: string) => void;
}

export const SearchComponent = (props: SearchComponentProps) => {

	const onInput = (e: FormEvent<HTMLInputElement>) => props.onInput?.(e.currentTarget.value);
	return (
		<SearchContainer>
			<SearchInput type="text" onInput={onInput} />
			<IconContainer>🔎</IconContainer>
			{
				props.children && (
					<DropdownContainer>
						{props.children}
					</DropdownContainer>
				)
			}
		</SearchContainer>
	);
}

const SearchContainer = styled.div`
	max-width: ${size(96)};
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;	
	justify-content: space-between;
	border: ${size(0.5)} solid ${Colors.border.toString()};
	position: relative;
`

const SearchInput = styled.input`
	flex-grow: 1;
	flex-basis: 0;
	display: block;
	padding: ${size(2)};
	border: none;
	background-color: transparent;
	&:focus-visible {
		outline: none;
	}
`

const IconContainer = styled.div`
	padding: ${size(2)};
`

const DropdownContainer = styled.div`
	position: absolute;
	top: 100%;
	z-index: ${zIndex.overlay};
	left: -${size(0.5)};
	right: -${size(0.5)};
	background-color: ${Colors.background.toString()};
	border: ${size(0.5)} solid ${Colors.border.toString()};
	display: flex;
	flex-direction: column;
`