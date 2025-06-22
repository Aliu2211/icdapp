import UserProfile from "@/src/components/dashboard/UserProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile - ICD App",
  description: "Manage your profile and account settings",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Your Profile</h1>
      <UserProfile />
    </div>
  );
}
