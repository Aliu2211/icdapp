import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { findUserByEmail, logUserStoreState } from '@/src/lib/user-store';

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug messages
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("=== AUTHORIZING CREDENTIALS ===");
        console.log("Email:", credentials?.email);
        logUserStoreState();
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Find user by email from shared user store
          const user = findUserByEmail(credentials.email);
          
          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          console.log("✓ User found:", user.email);
          
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          console.log("Password match:", passwordMatch);
          
          if (!passwordMatch) {
            console.log("❌ Password doesn't match");
            return null;
          }

          console.log("✓ Authentication successful for:", user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("❌ Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },    async session({ session, token }) {      if (session.user) {
        // Add ID to the session user object
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
