import styled from 'styled-components';
import { Colors, size, zIndex } from '../styles.ts';
import React, { FormEvent, ReactNode, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export interface SearchComponentProps {
	children?: ReactNode;
	onInput?: (query: string) => void;
}

export const SearchComponent = (props: SearchComponentProps) => {

	const [hasFocus, setHasFocus] = useState(false);

	const onInput = (e: FormEvent<HTMLInputElement>) => props.onInput?.(e.currentTarget.value);
	const onFocus = () => setHasFocus(true);
	const onBlur = (e: React.FocusEvent) => {
		if (e.relatedTarget && e.relatedTarget instanceof HTMLElement && e.relatedTarget.closest('.search-dropdown')) return;

		setTimeout(() => setHasFocus(false), 100);
	};
	return (
		<SearchContainer>
			<SearchInput type="text" onInput={onInput} onFocus={onFocus} onBlur={onBlur} />
			<IconContainer icon={faMagnifyingGlass} />
			{
				hasFocus && props.children && (
					<DropdownContainer className='search-dropdown'>
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

const IconContainer = styled(FontAwesomeIcon)`
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