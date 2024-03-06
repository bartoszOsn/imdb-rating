import { AppLayout } from './util/components/AppLayout.tsx';
import { Hr } from './util/components/Hr.tsx';
import { SearchShowComponent } from './ui/SearchShowComponent.tsx';
import { Outlet } from 'react-router-dom';
import { TooltipProvider } from './util/components/tooltip';

function App() {
  return (
    <TooltipProvider>
		<AppLayout>
			<SearchShowComponent />
			<Hr />
			<div className='flex-grow overflow-y-auto w-full flex flex-col items-center -mr-4'>
				<div className='max-w-2xl w-full'>
					<Outlet />
				</div>
			</div>
		</AppLayout>
    </TooltipProvider>
  )
}

export default App
