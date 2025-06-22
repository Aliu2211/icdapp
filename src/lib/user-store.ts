// Simple in-memory user store for development purposes
// In a real application, this would be replaced with a database

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  createdAt: string;
}

// Use the global object to persist data between API requests
// This is only for development - in production you'd use a database
declare global {
  var userStore: {
    users: User[];
  };
}

// Initialize the global user store if it doesn't exist
if (!global.userStore) {
  global.userStore = {
    users: [
      {
        id: '1',
        name: 'Demo User',
        email: 'user@example.com',
        password: '$2b$10$8OUhaaSycgH5iyuXLfsbV.BC3J4XLgw7Smo3KmVx/OiypaWdHw7oG', // hashed 'password123'
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

// Helper functions to work with the user store
export const findUserByEmail = (email: string): User | undefined => {
  console.log(`Finding user by email: ${email}`);
  console.log(`Current users in store: ${global.userStore.users.length}`);
  global.userStore.users.forEach(u => console.log(`- ${u.email}`));
  
  const user = global.userStore.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  console.log(`User found: ${!!user}`);
  return user;
};

// Debug function to log the current state of the user store
export const logUserStoreState = (): void => {
  console.log('===== USER STORE STATE =====');
  console.log(`Total users: ${global.userStore.users.length}`);
  global.userStore.users.forEach((user, index) => {
    console.log(`User ${index+1}: id=${user.id}, email=${user.email}, name=${user.name}`);
  });
  console.log('===========================');
};

export const addUser = (user: User): void => {
  console.log(`Adding new user: ${user.email}`);
  global.userStore.users.push(user);
  console.log(`Users in store after add: ${global.userStore.users.length}`);
  global.userStore.users.forEach(u => console.log(`- ${u.email}`));
};

export const getUserCount = (): number => {
  return global.userStore.users.length;
};

// Export users array for backward compatibility
export const users = global.userStore.users;
