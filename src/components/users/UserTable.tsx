
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { TeamMember } from "@/components/team/types/team-member";

interface UserTableProps {
  users: TeamMember[];
  isLoading: boolean;
  searchQuery: string;
  clearFilters: () => void;
  onEditUser: (user: TeamMember) => void;
  onDeleteUser: (user: TeamMember) => void;
}

export function UserTable({
  users,
  isLoading,
  searchQuery,
  clearFilters,
  onEditUser,
  onDeleteUser
}: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-primary rounded-full" />
                <span className="ml-2">Loading users...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              {searchQuery ? (
                <div>
                  <p className="text-muted-foreground">No users match the current filters</p>
                  <Button variant="link" onClick={clearFilters}>Clear filters</Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No users found in the system</p>
              )}
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.team_name}</Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={user.role.includes('Admin') || user.role.includes('Head') ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDeleteUser(user)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
