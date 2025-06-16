import { MessageSquare, Calendar } from "lucide-react";
import { RecentActivity } from "@/src/services/dashboard";

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Atividades Recentes
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 bg-gradient-to-br ${
              activity.type === 'diary' 
                ? 'from-green-50 to-emerald-50' 
                : 'from-blue-50 to-indigo-50'
            } rounded-lg`}>
              {activity.type === 'diary' ? (
                <MessageSquare className="w-4 h-4 text-green-600" />
              ) : (
                <Calendar className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-xs text-gray-600">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 