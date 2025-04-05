import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp } from "lucide-react";

// In a real app, this data would come from the API
const usageData = {
  apiCalls: { current: 247, limit: 1000, percent: 24.7 },
  imageGeneration: { current: 12, limit: 50, percent: 24 },
  textTokens: { current: 45.2, limit: 100, unit: "K", percent: 45.2 },
  resetTime: "3 days, 14 hours"
};

export default function UsageMonitoring() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Usage Monitoring</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          {!isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                API Calls Today
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {usageData.apiCalls.current} / {usageData.apiCalls.limit}
              </span>
            </div>
            <Progress value={usageData.apiCalls.percent} className="h-2 bg-slate-200 dark:bg-slate-600" />

            <div className="mt-4 flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Image Generation
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {usageData.imageGeneration.current} / {usageData.imageGeneration.limit}
              </span>
            </div>
            <Progress value={usageData.imageGeneration.percent} className="h-2 bg-slate-200 dark:bg-slate-600" />

            <div className="mt-4 flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Text Tokens
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {usageData.textTokens.current}{usageData.textTokens.unit} / {usageData.textTokens.limit}{usageData.textTokens.unit}
              </span>
            </div>
            <Progress value={usageData.textTokens.percent} className="h-2 bg-slate-200 dark:bg-slate-600" />

            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Usage resets in {usageData.resetTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
