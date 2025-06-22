import RegisterForm from "@/src/components/ui/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - ICD App",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Create an Account</h1>
        <p className="text-gray-300">
          Join us and get access to all features
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
