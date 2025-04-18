
import { Project } from "@/types";
import { format } from "date-fns";
import { Clock, RefreshCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface TrashBinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletedProjects: Project[];
  onRestore: (project: Project) => void;
  onDelete: (project: Project) => void;
  projectToRestore: Project | null;
  setProjectToRestore: (project: Project | null) => void;
  projectToPermanentDelete: Project | null;
  setProjectToPermanentDelete: (project: Project | null) => void;
  onConfirmRestore: () => void;
  onConfirmPermanentDelete: () => void;
}

export function TrashBinDialog({
  open,
  onOpenChange,
  deletedProjects,
  onRestore,
  onDelete,
  projectToRestore,
  setProjectToRestore,
  projectToPermanentDelete,
  setProjectToPermanentDelete,
  onConfirmRestore,
  onConfirmPermanentDelete
}: TrashBinDialogProps) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Trash Bin</DialogTitle>
            <DialogDescription>
              Projects that have been deleted. You can restore them or delete them permanently.
            </DialogDescription>
          </DialogHeader>
          
          {deletedProjects.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No deleted projects found</p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {deletedProjects.map(project => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50"
                >
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Badge className="mr-2">{project.team}</Badge>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(project.startDate!), "MMM d")} - {format(new Date(project.endDate!), "MMM d")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onRestore(project)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => onDelete(project)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete Forever
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!projectToRestore} onOpenChange={() => projectToRestore && setProjectToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore project?</AlertDialogTitle>
            <AlertDialogDescription>
              {projectToRestore && `This will restore the project "${projectToRestore.title}" back to the roadmap.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmRestore}>Restore</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={!!projectToPermanentDelete} onOpenChange={() => projectToPermanentDelete && setProjectToPermanentDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              {projectToPermanentDelete && `This will permanently delete the project "${projectToPermanentDelete.title}". This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onConfirmPermanentDelete}
            >
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
