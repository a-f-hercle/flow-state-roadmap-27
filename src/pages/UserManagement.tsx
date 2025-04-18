
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "sonner";

import { TeamMember } from "@/components/team/types/team-member";
import { fetchAllUsers, addUser, updateUser } from "@/components/team/services/team-member-service";

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

type UserFormValues = {
  name: string;
  email: string;
  team_name: string;
  role: string;
  isAdmin?: boolean;
  isActive?: boolean;
};

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
  const { toast } = useToast();
  
  const addUserForm = useForm<UserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      team_name: availableTeams[0],
      role: availableRoles[0],
      isAdmin: false,
      isActive: true
    }
  });

  const editUserForm = useForm<UserFormValues>();
  
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
      toast({
        title: "Error",
        description: "Failed to load users. Please try again later.",
        variant: "destructive"
      });
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
      addUserForm.reset();
      
      toast({
        title: "User added",
        description: `${data.name} was successfully added to the system.`
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive"
      });
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
      
      toast({
        title: "User updated",
        description: `${data.name}'s details were successfully updated.`
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real app, we would call an API to delete or deactivate the user
      // For now, we'll just remove from local state
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: "User removed",
        description: `${selectedUser.name} was successfully removed from the system.`
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to remove user. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const openEditDialog = (user: TeamMember) => {
    setSelectedUser(user);
    editUserForm.reset({
      name: user.name,
      email: user.email,
      team_name: user.team_name,
      role: user.role,
    });
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
              
              {(searchQuery || teamFilter || roleFilter) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-primary rounded-full" />
                      <span className="ml-2">Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchQuery || teamFilter || roleFilter ? (
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
                filteredUsers.map((user) => (
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
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(user)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system with their details and role.
            </DialogDescription>
          </DialogHeader>
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={addUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addUserForm.control}
                  name="team_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTeams.map(team => (
                            <SelectItem key={team} value={team}>{team}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addUserForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user details and role.
            </DialogDescription>
          </DialogHeader>
          <Form {...editUserForm}>
            <form onSubmit={editUserForm.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={editUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editUserForm.control}
                  name="team_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTeams.map(team => (
                            <SelectItem key={team} value={team}>{team}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editUserForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedUser?.name} from the system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteUser}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Toaster for notifications */}
      <Toaster />
    </div>
  );
}
