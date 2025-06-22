/**
 * Simple file-based database utility for storing data
 * In a production app, this would be replaced with a real database
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the data directory
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Generic database class for handling CRUD operations on JSON files
 */
export class FileDatabase<T extends { id: string }> {
  private filePath: string;
  private data: T[] = [];
  
  constructor(collectionName: string) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.loadData();
  }
  
  // Load data from file
  private loadData(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.data = [];
        // Create the file with empty array
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
      }
    } catch (error) {
      console.error(`Error loading data from ${this.filePath}:`, error);
      this.data = [];
    }
  }
  
  // Save data to file
  private saveData(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error(`Error saving data to ${this.filePath}:`, error);
    }
  }
  
  // Get all items
  findAll(): T[] {
    return [...this.data];
  }
  
  // Find items by filter function
  find(filterFn: (item: T) => boolean): T[] {
    return this.data.filter(filterFn);
  }
  
  // Get item by id
  findById(id: string): T | null {
    return this.data.find(item => item.id === id) || null;
  }
  
  // Create new item
  create(item: Omit<T, 'id'>): T {
    const newItem = { ...item, id: uuidv4() } as T;
    this.data.push(newItem);
    this.saveData();
    return newItem;
  }
  
  // Update item
  update(id: string, updates: Partial<T>): T | null {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const updatedItem = { ...this.data[index], ...updates };
    this.data[index] = updatedItem;
    this.saveData();
    return updatedItem;
  }
  
  // Delete item
  delete(id: string): boolean {
    const initialLength = this.data.length;
    this.data = this.data.filter(item => item.id !== id);
    
    if (initialLength !== this.data.length) {
      this.saveData();
      return true;
    }
    return false;
  }
  
  // Clear all data
  clear(): void {
    this.data = [];
    this.saveData();
  }
}

// Specific database instances
export const projectsDb = new FileDatabase<import('../../types/global').Project>('projects');
