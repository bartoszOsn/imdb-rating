import { AppLayout } from './util/components/AppLayout.tsx';
import { SearchShowComponent } from './ui/SearchShowComponent.tsx';
import { Link, Outlet } from 'react-router-dom';
import { TooltipProvider } from './util/components/tooltip';
import { AppHeader } from './util/components/AppHeader.tsx';
import { Hr } from './util/components/Hr.tsx';

function App() {
  return (
    <TooltipProvider>
		<AppLayout>
			<AppHeader left={<Link to='/'><img src='/wordmark.svg' alt='Tablesode' className='h-8' /></Link> }>
				<SearchShowComponent />
			</AppHeader>
			<div className='flex-grow overflow-y-auto w-full flex flex-col items-center -mr-4'>
				<div className='max-w-2xl w-full pt-2'>
					<Outlet/>
				</div>
				<Hr className='mb-4 mt-16'/>
				<p className='mb-2 flex items-center gap-2'>
					<span>Made by </span>
					<a className='flex gap-0.5 items-center underline' href='https://github.com/bartoszOsn' target='_blank' rel='noreferrer'>
						<img src='/github-mark.svg' alt='GitHub' className='h-4'/>
						Bartosz Osiński
					</a>
				</p>
				<p className='mb-4 flex items-center gap-2'>
					<span>Tablesode uses data from</span>
					<a href='https://www.themoviedb.org/' target='_blank' rel='noreferrer'>
						<img
							src='https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg'
							alt='The Movie Database' className='h-3'/>
					</a>
				</p>
			</div>
		</AppLayout>
	</TooltipProvider>
  )
}

export default App
