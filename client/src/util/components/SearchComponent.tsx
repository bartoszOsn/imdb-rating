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

	const searchContainerClasses = 'max-w-sm w-full flex flex-row items-center justify-between border-2 border-border relative'
	const searchInputClasses = 'flex-grow flex-basis-0 block p-2 bg-transparent border-none focus:outline-none'
	const dropdownContainerClasses = 'search-dropdown absolute top-full z-overlay -left-0.5 -right-0.5 bg-background border-2 border-border flex flex-col';

	return (
		<div className={searchContainerClasses}>
			<input className={searchInputClasses} type="text" onInput={onInput} onFocus={onFocus} onBlur={onBlur} />
			<FontAwesomeIcon className="p-2" icon={faMagnifyingGlass} />
			{
				hasFocus && props.children && (
					<div className={dropdownContainerClasses}>
						{props.children}
					</div>
				)
			}
		</div>
	);
}
