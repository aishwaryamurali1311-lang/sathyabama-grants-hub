import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, Clock, Building2, GraduationCap, Calendar } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const statusMap: Record<string, string> = {
  on_going: 'On-Going',
  completed: 'Completed',
  terminated: 'Terminated',
};

const FacultyHome: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: projects, isLoading } = useProjects();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-foreground text-background';
      case 'on_going': return 'bg-success text-success-foreground';
      case 'terminated': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN').format(amount);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      </MainLayout>
    );
  }

  const userProjects = projects ?? [];

  return (
    <MainLayout>
      <div className="space-y-4">
        {userProjects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <CardContent className="p-0">
              <div className="flex">
                {/* Maroon side stripe */}
                <div className="w-2 bg-primary rounded-l-lg" />
                
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{project.title}</h3>
                      <p className="text-xs text-muted-foreground">#{project.reference_id}</p>
                    </div>
                    <Badge className={getStatusBadgeClass(project.status)}>
                      {statusMap[project.status] || project.status}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{project.funding_agency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{(project.departments as any)?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatCurrency(Number(project.sanctioned_budget))}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{project.sanctioned_date || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{project.duration_months} months</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {userProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No projects found. Click "Add Project" to create one.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FacultyHome;
