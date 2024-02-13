import { createGlobalStyle } from 'styled-components';
import { Colors } from './styles.ts';

export const GlobalStyles = createGlobalStyle`
  body, html {
	font-family: 'Arial', sans-serif;
	background-color: ${Colors.background.toString()};
	color: ${Colors.text.toString()};
	margin: 0;
	padding: 0;
  }
  
  * {
	box-sizing: border-box;
  }
`;