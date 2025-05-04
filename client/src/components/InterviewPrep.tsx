import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useInterviewQuestions } from '../hooks/useInterviewQuestions';

interface Props {
  titles: string[];
  companies: string[];
}

export const InterviewPrep = ({ titles, companies }: Props) => {
  const [selectedTitle, setSelectedTitle] = useState<string>(titles[0] ?? 'Intern');
  const [selectedCompany, setSelectedCompany] = useState<string>(companies[0] ?? 'Google');
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState<boolean>(false); // 👈 New

  const {
    staticQuestions,
    dynamicQuestions,
    isLoading,
    refetchDynamicQuestions,
  } = useInterviewQuestions(selectedTitle, selectedCompany);

  const handleRefresh = async () => {
    const now = Date.now();

    if (lockUntil && now < lockUntil) {
      alert('🔒 You’ve hit the refresh limit. Try again later.');
      return;
    }

    if (refreshCount >= 10) {
      const lockDuration = 2 * 60 * 60 * 1000; // 2 hours
      setLockUntil(now + lockDuration);
      alert('🔒 Refresh limit reached. Locked for 2 hours.');
      return;
    }

    setIsLoadingDynamic(true); // ⏳ Start spinner
    await refetchDynamicQuestions(); // 🔁 Dynamic only
    setRefreshCount((prev) => prev + 1);
    setIsLoadingDynamic(false); // ✅ Stop spinner
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        Interview Prep
      </h1>

      {/* Dropdown Controls */}
      <div className="flex gap-4 mb-4">
        {/* Title Selector */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Job Setting</label>
          <select
            className="rounded-lg border px-3 py-2 dark:bg-gray-700 dark:text-white"
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
          >
            {titles.map((title, i) => (
              <option key={i} value={title}>{title}</option>
            ))}
          </select>
        </div>

        {/* Company Selector */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Company</label>
          <select
            className="rounded-lg border px-3 py-2 dark:bg-gray-700 dark:text-white"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            {companies.map((company, i) => (
              <option key={i} value={company}>{company}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
        ) : (
          <>
            {/* Static Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Common Questions
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {staticQuestions.map((q, i) => (
                  <li key={`static-${i}`} className="text-gray-700 dark:text-gray-300">
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dynamic Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  AI-Generated for {selectedCompany}
                </h3>
                <button
                  onClick={handleRefresh}
                  disabled={!!lockUntil && Date.now() < lockUntil}
                  className="p-2 rounded-full text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh AI Questions"
                >
                  <RotateCcw
                    className={`w-5 h-5 transition-transform ${isLoadingDynamic ? 'animate-spin [animation-direction:reverse]' : ''}`}
                  />
                </button>
              </div>

              {dynamicQuestions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {dynamicQuestions.map((q, i) => (
                    <li key={`dynamic-${i}`} className="text-gray-700 dark:text-gray-300">
                      {q}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No questions available yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
