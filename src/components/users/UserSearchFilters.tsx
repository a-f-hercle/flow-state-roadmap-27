
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface UserSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  teamFilter: string | null;
  setTeamFilter: (team: string | null) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  uniqueTeams: string[];
  uniqueRoles: string[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function UserSearchFilters({
  searchQuery,
  setSearchQuery,
  teamFilter,
  setTeamFilter,
  roleFilter,
  setRoleFilter,
  uniqueTeams,
  uniqueRoles,
  clearFilters,
  hasActiveFilters
}: UserSearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={teamFilter || ""} onValueChange={(value) => setTeamFilter(value || null)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Teams</SelectItem>
            {uniqueTeams.map(team => (
              <SelectItem key={team} value={team}>{team}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={roleFilter || ""} onValueChange={(value) => setRoleFilter(value || null)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            {uniqueRoles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
