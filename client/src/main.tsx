import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { TvShowRoute } from './ui/TvShowRoute.tsx';
import './index.css';

const router = createHashRouter([
	{
		path: '/',
		element: <App/>,
		children: [
			{
				path: '/',
				element: <h1>Home</h1>
			},
			{
				path: '/tv-show/:id',
				Component: TvShowRoute
			}
		]
	}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
