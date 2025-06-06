import { useAnalytics } from '../hooks/useAnalytics';
import { SalaryLineChart } from '../components/charts/SalaryLineChart';
import { CompanyBarChart } from '../components/charts/CompanyBarChart';
import { LocationPieChart } from '../components/charts/LocationPieChart';
import { InterviewPrep } from '../components/InterviewPrep';
import RecommendedJobs from '../components/RecommendedJobs';

export const ProfileAnalyticsPage = () => {
  const { salaryHistory, companyFavorites, locationSpread, isLoading } = useAnalytics();

  const titles = salaryHistory.map((entry: { title: string }) => entry.title).filter(Boolean);
  const companies = companyFavorites.map((entry: { company: string }) => entry.company).filter(Boolean);

  if (isLoading) return <div className="text-center p-10">Loading analytics...</div>;

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 max-w-7xl mx-auto space-y-12">
      <section className="w-full">
        <InterviewPrep titles={titles} companies={companies} />
      </section>

      <section className="space-y-10 w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Job Analytics
        </h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Salary Trends</h2>
            <SalaryLineChart data={salaryHistory} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Top Hiring Companies</h2>
            <CompanyBarChart data={companyFavorites} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Jobs Favorited by Region</h2>
            <LocationPieChart data={locationSpread} />
          </div>
        </div>
      </section>

      <section className="w-full">
        <RecommendedJobs />
      </section>
    </div>
  );
};