import { useState } from 'react';
import { useInterviewQuestions } from '../hooks/useInterviewQuestions';

interface Props {
  titles: string[];
  companies: string[];
}

export const InterviewPrep = ({ titles, companies }: Props) => {
  const [selectedTitle, setSelectedTitle] = useState<string>(titles[0] ?? 'Intern');
  const [selectedCompany, setSelectedCompany] = useState<string>(companies[0] ?? 'Google');

  const {
    staticQuestions,
    dynamicQuestions,
    isLoading,
  } = useInterviewQuestions(selectedTitle, selectedCompany);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Interview Prep
      </h1>

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
            {dynamicQuestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  AI-Generated for {selectedCompany}
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {dynamicQuestions.map((q, i) => (
                    <li key={`dynamic-${i}`} className="text-gray-700 dark:text-gray-300">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
