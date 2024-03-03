import { AppLayout } from './util/components/AppLayout.tsx';
import { Hr } from './util/components/Hr.tsx';
import { SearchShowComponent } from './ui/SearchShowComponent.tsx';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { size } from './util/styles.ts';

function App() {
  return (
    <>
		<AppLayout>
			<SearchShowComponent />
			<Hr />
			<AppRoute>
				<Outlet />
			</AppRoute>
		</AppLayout>
    </>
  )
}

export default App

const AppRoute = styled.div`
	flex-grow: 1;
	overflow-y: auto;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: -${size(4)};
`;