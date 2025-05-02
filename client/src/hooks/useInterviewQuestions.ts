import useSWR from 'swr';

interface InterviewResponse {
  static: string[];
  dynamic: string[];
}

const fetcher = (url: string, body: any) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const useInterviewQuestions = (title: string, company?: string) => {
  const { data, error, isLoading } = useSWR<InterviewResponse>(
    title ? ['/api/interview/questions', { title, company }] : null,
    ([url, body]) => fetcher(url, body),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    staticQuestions: data?.static ?? [],
    dynamicQuestions: data?.dynamic ?? [],
    isLoading,
    isError: !!error,
  };
};
