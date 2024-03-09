import { AppLayout } from './util/components/AppLayout.tsx';
import { SearchShowComponent } from './ui/SearchShowComponent.tsx';
import { Link, Outlet } from 'react-router-dom';
import { TooltipProvider } from './util/components/tooltip';
import { AppHeader } from './util/components/AppHeader.tsx';

function App() {
  return (
    <TooltipProvider>
		<AppLayout>
			<AppHeader left={<Link to='/'><img src='/wordmark.svg' alt='Tablesode' className='h-8' /></Link> }>
				<SearchShowComponent />
			</AppHeader>
			<div className='flex-grow overflow-y-auto w-full flex flex-col items-center -mr-4'>
				<div className='max-w-2xl w-full pt-2'>
					<Outlet />
				</div>
			</div>
		</AppLayout>
    </TooltipProvider>
  )
}

export default App
