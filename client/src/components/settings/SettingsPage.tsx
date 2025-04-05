import ApiConfigSection from "./ApiConfigSection";
import ModelSelectionSection from "./ModelSelectionSection";
import UsageMonitoring from "./UsageMonitoring";

export default function SettingsPage() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure your NPCSH experience and API connections.
        </p>

        <div className="mt-6 bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
          <ApiConfigSection />
          <ModelSelectionSection />
          <UsageMonitoring />
        </div>
      </div>
    </div>
  );
}
