
import { useParams } from "react-router-dom";
import { TaskDetail } from "@/components/roadmap/task-detail";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  return <TaskDetail id={id} />;
}
