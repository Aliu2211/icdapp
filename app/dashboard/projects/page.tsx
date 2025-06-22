'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/src/types/global';
import { fetchProjects, createProject, deleteProject } from '@/src/lib/api';

export default function ProjectsPage() {  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'progress'>('updated');
  const [loading, setLoading] = useState(true);
  
  // Projects data state
  const [projects, setProjects] = useState<Project[]>([]);
  
  // New project form data
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'fullstack' as 'canister' | 'frontend' | 'fullstack',
    tags: [] as string[]
  });
  
  // Fetch projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  // Handle creating a new project
  const handleCreateProject = async () => {
    try {
      if (!newProject.name || !newProject.description) {
        return; // Add validation UI feedback in a real application
      }
      
      setLoading(true);      const createdProject = await createProject({
        userId: 'current-user@example.com', // Using email as userId
        name: newProject.name,
        description: newProject.description,
        type: newProject.type,
        tags: newProject.tags,
        status: 'draft'
      });
      
      if (createdProject) {
        setProjects(prevProjects => [createdProject, ...prevProjects]);
        // Reset form
        setNewProject({
          name: '',
          description: '',
          type: 'fullstack',
          tags: []
        });
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle deleting a project
  const handleDeleteProject = async (projectId: string) => {
    try {
      const success = await deleteProject(projectId);
      if (success) {
        setProjects(prevProjects => 
          prevProjects.filter(project => project.id !== projectId)
        );
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      // Apply search query filter
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      // Apply type filter
      const matchesType = !filterType || project.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'progress') {
        return b.progress - a.progress;
      } else { // 'updated'
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div>
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage and organize your ICP development projects</p>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium rounded-md transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Project
        </button>
      </div>

      {/* Search and filters bar */}
      <div className="bg-gray-900/30 border border-gray-800/40 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              type="search" 
              className="block w-full p-2.5 pl-10 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
              placeholder="Search projects or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              className="bg-gray-800/50 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 pr-8"
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value || null)}
            >
              <option value="">All Types</option>
              <option value="canister">Canister</option>
              <option value="frontend">Frontend</option>
              <option value="fullstack">Full Stack</option>
            </select>
            
            <select
              className="bg-gray-800/50 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 pr-8"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'updated' | 'progress')}
            >
              <option value="updated">Latest Updated</option>
              <option value="name">Name</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton cards
          Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`} 
              className="bg-gray-900/40 border border-gray-800/50 rounded-lg overflow-hidden animate-pulse"
            >
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-gray-800 mr-3"></div>
                    <div className="h-5 w-40 bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-800 rounded mt-4 w-full"></div>
                <div className="h-4 bg-gray-800 rounded mt-2 w-2/3"></div>
              </div>
              <div className="px-5 pb-3">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-800 rounded"></div>
                  <div className="h-6 w-16 bg-gray-800 rounded"></div>
                </div>
              </div>
              <div className="px-5 pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-3 w-16 bg-gray-800 rounded"></div>
                  <div className="h-3 w-8 bg-gray-800 rounded"></div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5"></div>
              </div>
              <div className="px-5 py-3 mt-auto border-t border-gray-800/40">
                <div className="h-4 w-24 bg-gray-800 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="bg-gray-900/40 border border-gray-800/50 hover:border-purple-900/50 rounded-lg overflow-hidden transition-all duration-200 flex flex-col"
            >
              {/* Project Header with type badge */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 ${
                      project.type === 'canister' ? 'bg-blue-600/20' : 
                      project.type === 'frontend' ? 'bg-purple-600/20' : 
                      'bg-green-600/20'
                    }`}>
                      {project.type === 'canister' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                        </svg>
                      ) : project.type === 'frontend' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-white font-medium line-clamp-1">{project.name}</h3>
                  </div>
                  <div className="flex">
                    <button
                      className="p-1 text-gray-400 hover:text-red-400"
                      onClick={() => handleDeleteProject(project.id)}
                      title="Delete Project"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-300 ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-3 line-clamp-2">{project.description}</p>
              </div>
              
              {/* Tags */}
              <div className="px-5 pb-3">
                <div className="flex flex-wrap gap-2">
                  {project.tags && project.tags.map((tag, index) => (
                    <span key={`${project.id}-tag-${index}`} className="text-xs bg-gray-800/70 text-gray-300 px-2 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-5 pb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs text-gray-400">Progress</div>
                  <div className="text-xs text-gray-400">{project.progress}%</div>
                </div>
                <div className="w-full bg-gray-800/70 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      project.progress < 30 ? 'bg-red-500' :
                      project.progress < 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-5 py-3 mt-auto border-t border-gray-800/40 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Updated {formatDate(project.lastUpdated)}
                </div>
                
                {/* If project has deployment target or collaborators, show indicators */}
                <div className="flex items-center space-x-3">
                  {project.deploymentTarget && (
                    <div className={`flex items-center ${
                      project.deploymentTarget === 'ic' ? 'text-green-400' :
                      project.deploymentTarget === 'staging' ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1"></span>
                      <span className="text-xs">
                        {project.deploymentTarget === 'ic' ? 'IC Mainnet' :
                         project.deploymentTarget === 'staging' ? 'Staging' :
                         'Local'}
                      </span>
                    </div>
                  )}
                  
                  {project.collaborators && (
                    <div className="flex items-center text-purple-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-xs">{project.collaborators}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* "Create New" card at the end */}
        <div 
          className="bg-gray-900/20 border border-gray-800/30 border-dashed hover:border-purple-700/50 hover:bg-purple-900/10 rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer transition-all"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <div className="h-14 w-14 rounded-full bg-purple-900/20 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">Create New Project</h3>
          <p className="text-sm text-gray-400 text-center">Start building your next ICP dapp</p>
        </div>
      </div>

      {/* No Results State */}
      {!loading && filteredProjects.length === 0 && (
        <div className="text-center bg-gray-900/30 rounded-lg border border-gray-800/40 p-8 mt-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-800/50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filters, or create a new project.</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setFilterType(null);
            }}
            className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 text-white text-sm font-medium rounded-md transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/70 transition-opacity" aria-hidden="true" onClick={() => setIsCreateModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="relative inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-5 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white" id="modal-title">
                    Create New Project
                  </h3>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-400 mb-6">Select a project type to get started with your ICP development</p>

                {/* Project Type Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div 
                    className={`border border-blue-900/30 hover:border-blue-500/50 ${newProject.type === 'canister' ? 'bg-blue-900/20' : 'bg-blue-900/10'} hover:bg-blue-900/20 rounded-lg p-4 cursor-pointer transition-all`}
                    onClick={() => setNewProject({...newProject, type: 'canister'})}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-lg bg-blue-900/30 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium mb-1">Canister</h4>
                      <p className="text-xs text-gray-400 text-center">Backend logic with Motoko/Rust</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`border border-purple-900/30 hover:border-purple-500/50 ${newProject.type === 'frontend' ? 'bg-purple-900/20' : 'bg-purple-900/10'} hover:bg-purple-900/20 rounded-lg p-4 cursor-pointer transition-all`}
                    onClick={() => setNewProject({...newProject, type: 'frontend'})}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium mb-1">Frontend</h4>
                      <p className="text-xs text-gray-400 text-center">Next.js/React UI application</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`border border-green-900/30 hover:border-green-500/50 ${newProject.type === 'fullstack' ? 'bg-green-900/20' : 'bg-green-900/10'} hover:bg-green-900/20 rounded-lg p-4 cursor-pointer transition-all`}
                    onClick={() => setNewProject({...newProject, type: 'fullstack'})}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-lg bg-green-900/30 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium mb-1">Full Stack</h4>
                      <p className="text-xs text-gray-400 text-center">Complete frontend & backend dapp</p>
                    </div>
                  </div>
                </div>

                {/* Form placeholder - in a real app, this would be expanded */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>                  
                    <input
                      type="text"
                      className="w-full p-2.5 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      placeholder="My ICP dApp"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>                  
                    <textarea
                      rows={3}
                      className="w-full p-2.5 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Describe your project..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-800/50 flex justify-end">
                <button
                  className="px-4 py-2 mr-3 border border-gray-700 text-gray-300 hover:text-white rounded-md transition-colors"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>                
                <button
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
                  onClick={handleCreateProject}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
