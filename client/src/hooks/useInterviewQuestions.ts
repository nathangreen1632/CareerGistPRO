import { useState } from 'react';
import useSWR from 'swr';

interface InterviewResponse {
  static: string[];
  dynamic: string[];
}

const fetcher = async (url: string, body: any): Promise<InterviewResponse> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`⚠️ Interview API returned non-OK status: ${res.status}`);
      return { static: [], dynamic: [] };
    }

    return await res.json();
  } catch (error) {
    console.error('❌ Interview question fetch failed:', error);
    return { static: [], dynamic: [] };
  }
};

export const useInterviewQuestions = (title: string, company?: string) => {
  // ✅ All hooks are called unconditionally
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);

  const shouldFetch = !!title;

  const { data, error, isLoading, mutate } = useSWR<InterviewResponse>(
    shouldFetch ? ['/api/interview/questions', { title, company }] : null,
    ([url, body]) => fetcher(url, body),
    {
      revalidateOnFocus: false,
    }
  );

  const refetchDynamicQuestions = async () => {
    setIsLoadingDynamic(true);

    const freshData = await fetcher('/api/interview/questions', { title, company });
    await mutate(
      (current) => ({
        static: current?.static ?? [],
        dynamic: freshData.dynamic ?? [],
      }),
      false
    );

    setIsLoadingDynamic(false);
  };

  return {
    staticQuestions: data?.static ?? [],
    dynamicQuestions: data?.dynamic ?? [],
    isLoading,
    isLoadingDynamic,
    isError: !!error,
    refetchDynamicQuestions,
  };
};
