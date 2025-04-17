
import { HistoryEntry } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Clock, 
  BarChart, 
  Shuffle, 
  Calendar, 
  Edit, 
  FilePlus, 
  ClipboardCheck 
} from "lucide-react";

interface ProjectHistoryProps {
  history?: HistoryEntry[];
}

export function ProjectHistory({ history }: ProjectHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No history records available for this project</p>
        </CardContent>
      </Card>
    );
  }

  // Sort history with newest first
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <FilePlus className="h-4 w-4" />;
      case 'updated':
        return <Edit className="h-4 w-4" />;
      case 'phase-change':
        return <Shuffle className="h-4 w-4" />;
      case 'timeline-change':
        return <Calendar className="h-4 w-4" />;
      case 'characteristic-change':
        return <BarChart className="h-4 w-4" />;
      default:
        return <ClipboardCheck className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return "bg-green-500";
      case 'updated':
        return "bg-blue-500";
      case 'phase-change':
        return "bg-purple-500";
      case 'timeline-change':
        return "bg-amber-500";
      case 'characteristic-change':
        return "bg-indigo-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatValue = (value: any) => {
    if (value instanceof Date) {
      return format(value, "MMM d, yyyy");
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return value?.toString() || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedHistory.map((entry) => (
            <div key={entry.id} className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(entry.action)} text-white shrink-0`}>
                {getActionIcon(entry.action)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 capitalize">
                      {entry.action.replace('-', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      by {entry.user}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>
                      {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm">
                  {entry.details.description || (
                    entry.details.field ? 
                      `Changed ${entry.details.field} from "${formatValue(entry.details.previousValue)}" to "${formatValue(entry.details.newValue)}"` : 
                      `Modified project`
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
