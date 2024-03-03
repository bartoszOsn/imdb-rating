import { AppLayout } from './util/components/AppLayout.tsx';
import { Hr } from './util/components/Hr.tsx';
import { SearchShowComponent } from './ui/SearchShowComponent.tsx';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
		<AppLayout>
			<SearchShowComponent />
			<Hr />
			<div className='flex-grow overflow-y-auto w-full flex flex-col items-center -mr-4'>
				<Outlet />
			</div>
		</AppLayout>
    </>
  )
}

export default App
