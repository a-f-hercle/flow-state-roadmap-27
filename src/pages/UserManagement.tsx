
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

import { TeamMember } from "@/components/team/types/team-member";
import { fetchAllUsers, addUser, updateUser, deleteUser } from "@/services/userService";
import { UserTable } from "@/components/users/UserTable";
import { UserSearchFilters } from "@/components/users/UserSearchFilters";
import { UserFormDialog, UserFormValues } from "@/components/users/UserFormDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";

// Available teams and roles for selection
const availableTeams = [
  "Tech Trading", 
  "Tech Custody & Banking", 
  "Tech PMS", 
  "Tech Execution", 
  "Tech Infrastructure", 
  "Business Operations"
];

const availableRoles = [
  "Developer", 
  "Designer", 
  "Product Manager", 
  "Tech Lead", 
  "QA Engineer", 
  "Business Analyst", 
  "Department Head", 
  "Admin"
];

export default function UserManagement() {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, teamFilter, roleFilter]);
  
  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers); // Initialize filtered users with all users
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    if (!users || users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    
    let filtered = [...users];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
    
    // Apply team filter
    if (teamFilter) {
      filtered = filtered.filter(user => user.team_name === teamFilter);
    }
    
    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  };
  
  const handleAddUser = async (data: UserFormValues) => {
    try {
      const newUser = await addUser({
        name: data.name,
        email: data.email,
        team_name: data.team_name,
        role: data.role
      });
      
      setUsers(prev => [...prev, newUser as TeamMember]);
      setIsAddUserDialogOpen(false);
      
      toast.success(`${data.name} was successfully added to the system.`);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };
  
  const handleEditUser = async (data: UserFormValues) => {
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.id, {
        name: data.name,
        email: data.email,
        team_name: data.team_name,
        role: data.role
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, name: data.name, email: data.email, team_name: data.team_name, role: data.role } 
          : user
      ));
      
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      
      toast.success(`${data.name}'s details were successfully updated.`);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      
      toast.success(`${selectedUser.name} was successfully removed from the system.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to remove user. Please try again.");
    }
  };
  
  const openEditDialog = (user: TeamMember) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };
  
  const openDeleteDialog = (user: TeamMember) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setTeamFilter(null);
    setRoleFilter(null);
  };
  
  // Get unique role values for filter dropdown
  const uniqueRoles = Array.from(new Set(users?.map(user => user.role) || []));
  const uniqueTeams = Array.from(new Set(users?.map(user => user.team_name) || []));
  
  const hasActiveFilters = !!(searchQuery || teamFilter || roleFilter);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users and their roles across teams
          </p>
        </div>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
          
          <UserSearchFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            teamFilter={teamFilter}
            setTeamFilter={setTeamFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            uniqueTeams={uniqueTeams}
            uniqueRoles={uniqueRoles}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </CardHeader>
        <CardContent>
          <UserTable 
            users={filteredUsers}
            isLoading={loading}
            searchQuery={searchQuery}
            clearFilters={clearFilters}
            onEditUser={openEditDialog}
            onDeleteUser={openDeleteDialog}
          />
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <UserFormDialog 
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onSubmit={handleAddUser}
        title="Add New User"
        description="Add a new user to the system with their details and role."
        submitLabel="Add User"
        availableTeams={availableTeams}
        availableRoles={availableRoles}
      />
      
      {/* Edit User Dialog */}
      <UserFormDialog 
        isOpen={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
        onSubmit={handleEditUser}
        defaultValues={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email,
          team_name: selectedUser.team_name,
          role: selectedUser.role
        } : undefined}
        title="Edit User"
        description="Update the user details and role."
        submitLabel="Save Changes"
        availableTeams={availableTeams}
        availableRoles={availableRoles}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onConfirmDelete={handleDeleteUser}
      />
      
      {/* Add Toaster for notifications */}
      <Toaster />
    </div>
  );
}
