/**
 * Simple file-based database utility for development purposes
 * In a production environment, this would be replaced with a proper database
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Project, Subscription } from '@/src/types/global';

// Path to data directory
const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(PROJECTS_FILE)) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify([]));
}

/**
 * Projects Database Operations
 */

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  try {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects data:', error);
    return [];
  }
}

// Get projects for a specific user
export async function getUserProjects(userId: string): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter(project => project.userId === userId);
}

// Get a specific project by ID
export async function getProjectById(projectId: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find(project => project.id === projectId) || null;
}

// Create a new project
export async function createNewProject(project: Omit<Project, 'id' | 'lastUpdated' | 'createdAt'>): Promise<Project> {
  const projects = await getAllProjects();
  
  const now = new Date().toISOString();
  const newProject: Project = {
    ...project,
    id: uuidv4(),
    lastUpdated: now,
    createdAt: now,
    progress: project.progress || 0,
  };
  
  projects.push(newProject);
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  
  return newProject;
}

// Update an existing project
export async function updateExistingProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = await getAllProjects();
  const index = projects.findIndex(project => project.id === projectId);
  
  if (index === -1) return null;
  
  const updatedProject = {
    ...projects[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  
  projects[index] = updatedProject;
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  
  return updatedProject;
}

// Delete a project
export async function deleteExistingProject(projectId: string): Promise<boolean> {
  const projects = await getAllProjects();
  const filteredProjects = projects.filter(project => project.id !== projectId);
  
  if (filteredProjects.length === projects.length) return false;
  
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filteredProjects, null, 2));
  return true;
}

/**
 * Subscriptions Database Operations
 */

// Get all subscriptions
export async function getAllSubscriptions(): Promise<Subscription[]> {
  try {
    const data = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscriptions data:', error);
    return [];
  }
}

// Get a user's subscription
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const subscriptions = await getAllSubscriptions();
  return subscriptions.find(sub => sub.userId === userId) || null;
}

// Create or update a user's subscription
export async function upsertUserSubscription(subscription: Subscription): Promise<Subscription> {
  const subscriptions = await getAllSubscriptions();
  const index = subscriptions.findIndex(sub => sub.userId === subscription.userId);
  
  if (index === -1) {
    // Create new subscription
    subscriptions.push(subscription);
  } else {
    // Update existing subscription
    subscriptions[index] = subscription;
  }
  
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
  return subscription;
}

// Save all subscriptions to file
export async function saveAllSubscriptions(subscriptions: Subscription[]): Promise<void> {
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
}

/**
 * Dashboard Stats
 */

// Get dashboard statistics for a user
export async function getUserDashboardStats(userId: string) {
  const userProjects = await getUserProjects(userId);
  
  // Calculate statistics
  const totalProjects = userProjects.length;
  const activeProjects = userProjects.filter(p => p.status === 'active').length;
  const completedProjects = userProjects.filter(p => p.progress === 100).length;
  
  // Simulate canister cycles information
  const canisterCycles = Math.floor(Math.random() * 100000000000);
  
  // Get recently updated projects
  const recentProjects = [...userProjects]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 3);
  
  return {
    stats: {
      totalProjects,
      activeProjects,
      completedProjects,
      canisterCycles,
    },
    recentProjects,
  };
}
