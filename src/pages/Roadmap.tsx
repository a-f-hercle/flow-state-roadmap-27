import React, { useMemo } from 'react';
import { useProjects } from '@/context/project-context';
import { Project, TaskCategory, TaskStatus } from '@/types';
import { useNavigate } from 'react-router-dom';
import {
  addMonths,
  differenceInDays,
  format,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  startOfDay
} from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

// Helper function to get a consistent color based on team name
const getTeamColor = (teamName: string): string => {
  const colors = [
    'bg-blue-200 border-blue-400 text-blue-800',
    'bg-green-200 border-green-400 text-green-800',
    'bg-yellow-200 border-yellow-400 text-yellow-800',
    'bg-red-200 border-red-400 text-red-800',
    'bg-purple-200 border-purple-400 text-purple-800',
    'bg-pink-200 border-pink-400 text-pink-800',
    'bg-indigo-200 border-indigo-400 text-indigo-800',
    'bg-teal-200 border-teal-400 text-teal-800',
  ];
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const statusStyles: Record<TaskStatus, string> = {
  planned: "opacity-75",
  "in-progress": "",
  completed: "opacity-50 line-through",
  blocked: "border-red-500 border-dashed border-2",
};

const categoryLabels: Record<TaskCategory, string> = {
  feature: "Feature",
  bugfix: "Bug Fix",
  improvement: "Improvement",
  refactor: "Refactor",
  infrastructure: "Infrastructure",
  documentation: "Documentation",
  compliance: "Compliance",
  security: "Security"
};

const Roadmap: React.FC = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  const roadmapProjects = useMemo(() => {
    return projects
      .filter(
        (p): p is Project & { startDate: Date; endDate: Date } =>
          p.displayOnRoadmap && p.startDate && p.endDate && !p.isDeleted
      )
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [projects]);

  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (roadmapProjects.length === 0) {
      const now = new Date();
      return {
        minDate: startOfMonth(addMonths(now, -1)),
        maxDate: endOfMonth(addMonths(now, 2)),
        totalDays: differenceInDays(endOfMonth(addMonths(now, 2)), startOfMonth(addMonths(now, -1))) + 1,
      };
    }

    let earliestStart = roadmapProjects[0].startDate;
    let latestEnd = roadmapProjects[0].endDate;

    roadmapProjects.forEach(p => {
      if (p.startDate < earliestStart) earliestStart = p.startDate;
      if (p.endDate > latestEnd) latestEnd = p.endDate;
    });

    const paddedMinDate = startOfMonth(addMonths(earliestStart, -1));
    const paddedMaxDate = endOfMonth(addMonths(latestEnd, 1));
    const days = differenceInDays(paddedMaxDate, paddedMinDate) + 1;

    return { minDate: paddedMinDate, maxDate: paddedMaxDate, totalDays: days };
  }, [roadmapProjects]);

  const months = useMemo(() => {
    if (!minDate || !maxDate || totalDays <= 0) return [];
    const intervalMonths = eachMonthOfInterval({ start: minDate, end: maxDate });
    return intervalMonths.map(monthStart => {
      const monthEnd = endOfMonth(monthStart);
      const effectiveEnd = monthEnd > maxDate ? maxDate : monthEnd;
      const daysInMonth = differenceInDays(effectiveEnd, monthStart) + 1;
      const widthPercent = (daysInMonth / totalDays) * 100;
      return {
        date: monthStart,
        label: format(monthStart, 'MMM yyyy'),
        widthPercent,
      };
    });
  }, [minDate, maxDate, totalDays]);

  const calculateTimelineStyle = (startDate: Date, endDate: Date): React.CSSProperties => {
    if (!minDate || totalDays <= 0) return { left: '0%', width: '0%' };
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);
    const startOffsetDays = differenceInDays(start, minDate);
    const durationDays = differenceInDays(end, start) + 1;
    const leftPercent = Math.max(0, (startOffsetDays / totalDays) * 100);
    const widthPercent = Math.max(0.5, (durationDays / totalDays) * 100);
    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  const rowHeight = 40;
  const headerHeight = 40;
  const verticalGap = 8;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Roadmap</h1>
        <p className="text-muted-foreground">
          Visual timeline of ongoing and planned projects
        </p>
      </div>

      {roadmapProjects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Empty Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8 text-muted-foreground">
            <p>No projects are currently marked for display on the roadmap.</p>
            <p>Edit projects to include them here.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-1 overflow-auto relative">
            {/* Sticky Timeline Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="relative flex h-10" style={{ width: '100%' }}>
                {months.map(month => (
                  <div
                    key={month.date.toISOString()}
                    className="flex-shrink-0 border-r text-xs font-semibold flex items-center justify-center text-muted-foreground"
                    style={{ width: `${month.widthPercent}%` }}
                  >
                    {month.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Area */}
            <div
              className="relative overflow-x-auto"
              style={{ height: `${roadmapProjects.length * (rowHeight + verticalGap) + headerHeight}px` }}
            >
              {/* Month background lines */}
              {months.map((month, index) => {
                const leftPercent = months
                  .slice(0, index)
                  .reduce((acc, m) => acc + m.widthPercent, 0);
                return (
                  <div
                    key={`bg-${month.date.toISOString()}`}
                    className={cn("absolute top-10 bottom-0 border-r", index % 2 === 0 ? "bg-muted/30" : "")}
                    style={{ left: `${leftPercent}%`, width: `${month.widthPercent}%` }}
                  />
                );
              })}

              {/* TooltipProvider wraps all the bars */}
              <TooltipProvider delayDuration={100}>
                {roadmapProjects.map((project, index) => {
                  const timelineStyle = calculateTimelineStyle(project.startDate, project.endDate);
                  const topPosition = headerHeight + index * (rowHeight + verticalGap);

                  return (
                    <Tooltip key={project.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute h-8 rounded border cursor-pointer flex items-center px-2 text-xs font-medium overflow-hidden whitespace-nowrap",
                            getTeamColor(project.team),
                            project.status ? statusStyles[project.status] : ""
                          )}
                          style={{
                            ...timelineStyle,
                            top: `${topPosition}px`,
                            minWidth: '20px',
                            zIndex: 10
                          }}
                          onClick={() => navigate(`/projects/${project.id}`)}
                          title={project.title}
                        >
                          <span className="truncate">{project.title}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start">
                        <p className="font-bold">{project.title}</p>
                        <p>Team: {project.team}</p>
                        <p>Status: <Badge variant="outline" className="capitalize">{project.status || 'N/A'}</Badge></p>
                        {project.category && (
                          <p>Category: <Badge variant="secondary">{categoryLabels[project.category]}</Badge></p>
                        )}
                        <p>Dates: {format(project.startDate, "MMM d")} - {format(project.endDate, "MMM d, yyyy")}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Roadmap;
