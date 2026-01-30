import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProjectCard from '@/components/projects/ProjectCard';
import { mockProjects } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const FacultyHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter projects for faculty - only show their projects
  const userProjects = user?.role === 'faculty' 
    ? mockProjects.filter(p => p.piEmail === user.email)
    : mockProjects;

  return (
    <MainLayout>
      <div className="space-y-4">
        {userProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => navigate(`/project/${project.id}`)}
          />
        ))}

        {userProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No projects found. Click "Add Project" to create one.</p>
          </div>
        )}

        {/* Pagination placeholder */}
        <div className="flex justify-center pt-6">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            1
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FacultyHome;
