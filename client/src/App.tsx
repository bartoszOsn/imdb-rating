import { AppLayout } from './util/components/AppLayout.tsx';
import { Hr } from './util/components/Hr.ts';
import { SearchShowComponent } from './ui/SearchShowComponent.tsx';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
		<AppLayout>
			<SearchShowComponent />
			<Hr />
			<Outlet />
		</AppLayout>
    </>
  )
}

export default App
