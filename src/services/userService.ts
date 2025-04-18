
import { TeamMember } from "@/components/team/types/team-member";
import { 
  fetchAllUsers as apiFetchAllUsers, 
  addUser as apiAddUser,
  updateUser as apiUpdateUser
} from "@/components/team/services/team-member-service";

/**
 * Fetches all users from the system
 */
export const fetchAllUsers = async (): Promise<TeamMember[]> => {
  try {
    return await apiFetchAllUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users. Please try again later.");
  }
};

/**
 * Adds a new user to the system
 */
export const addUser = async (userData: Partial<TeamMember>): Promise<TeamMember> => {
  try {
    return await apiAddUser(userData);
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Failed to add user. Please try again.");
  }
};

/**
 * Updates an existing user in the system
 */
export const updateUser = async (userId: string, userData: Partial<TeamMember>): Promise<void> => {
  try {
    return await apiUpdateUser(userId, userData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user. Please try again.");
  }
};

/**
 * Deletes a user from the system
 * Note: In a real app, this would call an API endpoint
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // In a real app, we would call an API endpoint
    console.log(`User with ID ${userId} deleted`);
    return Promise.resolve();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user. Please try again.");
  }
};
