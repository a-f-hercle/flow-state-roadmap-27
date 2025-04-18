
/**
 * Gets the next status in the workflow
 */
export const getNextStatus = (currentStatus: string) => {
  const statusFlow = ['planned', 'in-progress', 'completed', 'blocked'];
  const currentIndex = statusFlow.indexOf(currentStatus);
  return statusFlow[(currentIndex + 1) % statusFlow.length];
};

/**
 * Gets the display label for a status
 */
export const getStatusLabel = (status: string | undefined) => {
  if (!status) return '';
  
  switch(status) {
    case 'completed': return 'Completed';
    case 'in-progress': return 'In Progress';
    case 'planned': return 'Planned';
    case 'blocked': return 'Blocked';
    default: return status;
  }
};

/**
 * Gets the color class for a status
 */
export const getStatusColor = (status: string | undefined) => {
  switch(status) {
    case 'completed': return 'bg-green-500';
    case 'in-progress': return 'bg-blue-500';
    case 'blocked': return 'bg-red-500';
    default: return 'bg-amber-500';
  }
};

/**
 * Gets the border style for a status
 */
export const getStatusStyle = (status: string | undefined) => {
  switch(status) {
    case 'completed': return 'border-l-4 border-l-green-500';
    case 'in-progress': return 'border-l-4 border-l-blue-500';
    case 'planned': return 'border-l-4 border-l-amber-500';
    case 'blocked': return 'border-l-4 border-l-red-500';
    default: return 'border-l-4 border-l-amber-500';
  }
};
