import useSWR from 'swr';

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('🚫 No token available yet, skipping analytics fetch');
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get('content-type') ?? '';
    if (!response.ok || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Analytics fetch error: Not JSON\n', text);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('❌ Analytics fetch error:', err);
    return null;
  }
};

export const useAnalytics = () => {
  const token = localStorage.getItem('token');

  const { data, error, isLoading } = useSWR(
    token ? '/api/analytics/profile' : null,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 300000,
    }
  );

  return {
    salaryHistory: data?.salaryHistory ?? [],
    companyFavorites: data?.companyFavorites ?? [],
    locationSpread: data?.locationSpread ?? [],
    isLoading,
    isError: !!error || data === null,
  };
};
