
import { UserProfile } from "@/components/user/user-profile";

export default function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and team information
        </p>
      </div>
      
      <UserProfile />
    </div>
  );
}
