export function fetchTMDB<TResponse>(endpoint: `/${string}`): Promise<TResponse> {
	const options = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
		},
	};

	return fetch(`https://api.themoviedb.org/3${endpoint}`, options)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Failed to fetch from TMDB');
			}
			return response.json();
		});
}