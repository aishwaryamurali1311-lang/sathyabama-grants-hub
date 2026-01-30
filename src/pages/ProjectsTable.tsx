import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Filter } from 'lucide-react';
import { mockProjects } from '@/data/mockData';
import { cn } from '@/lib/utils';

const ProjectsTable: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    id: '',
    referenceId: '',
    title: '',
    department: '',
    duration: '',
    agency: '',
    budget: '',
    status: '',
    date: '',
    pi: '',
  });
  
  const [selectedDocs, setSelectedDocs] = useState({
    sanctionLetter: false,
    utilizationCertificates: false,
    releaseOrder: false,
    activitiesReports: false,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-success';
      case 'On-Going':
        return 'text-success';
      case 'Terminated':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredProjects = mockProjects.filter(project => {
    if (filters.title && !project.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
    if (filters.department && !project.department.toLowerCase().includes(filters.department.toLowerCase())) return false;
    if (filters.agency && !project.fundingAgency.toLowerCase().includes(filters.agency.toLowerCase())) return false;
    if (filters.status && !project.status.toLowerCase().includes(filters.status.toLowerCase())) return false;
    return true;
  });

  return (
    <MainLayout>
      <Card>
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Project Display Table</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="sanctionLetter"
                checked={selectedDocs.sanctionLetter}
                onCheckedChange={(checked) => setSelectedDocs(prev => ({ ...prev, sanctionLetter: !!checked }))}
                className="border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
              />
              <label htmlFor="sanctionLetter" className="text-sm">Sanction Letter</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="utilizationCertificates"
                checked={selectedDocs.utilizationCertificates}
                onCheckedChange={(checked) => setSelectedDocs(prev => ({ ...prev, utilizationCertificates: !!checked }))}
                className="border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
              />
              <label htmlFor="utilizationCertificates" className="text-sm">Utilization Certificates</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="releaseOrder"
                checked={selectedDocs.releaseOrder}
                onCheckedChange={(checked) => setSelectedDocs(prev => ({ ...prev, releaseOrder: !!checked }))}
                className="border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
              />
              <label htmlFor="releaseOrder" className="text-sm">Release Order</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="activitiesReports"
                checked={selectedDocs.activitiesReports}
                onCheckedChange={(checked) => setSelectedDocs(prev => ({ ...prev, activitiesReports: !!checked }))}
                className="border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
              />
              <label htmlFor="activitiesReports" className="text-sm">Activites Reports</label>
            </div>
            <Button variant="secondary" size="sm" className="text-primary">
              <Download className="h-4 w-4 mr-1" />
              Get Documents
            </Button>
            <Button variant="secondary" size="sm" className="text-destructive">
              <Download className="h-4 w-4 mr-1" />
              Export as CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Id</TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Duration (in months)</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>Sanctioned Budget (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sanctioned Date</TableHead>
                  <TableHead>PI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Filter row */}
                <TableRow className="bg-muted/30">
                  <TableCell>
                    <Input 
                      className="h-8 w-16" 
                      placeholder=""
                      value={filters.id}
                      onChange={(e) => setFilters(prev => ({ ...prev, id: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.referenceId}
                      onChange={(e) => setFilters(prev => ({ ...prev, referenceId: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.title}
                      onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.department}
                      onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.duration}
                      onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.agency}
                      onChange={(e) => setFilters(prev => ({ ...prev, agency: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.budget}
                      onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.date}
                      onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      placeholder=""
                      value={filters.pi}
                      onChange={(e) => setFilters(prev => ({ ...prev, pi: e.target.value }))}
                    />
                    <Filter className="h-3 w-3 mt-1 text-muted-foreground" />
                  </TableCell>
                </TableRow>
                
                {/* Data rows */}
                {filteredProjects.map((project, idx) => (
                  <TableRow 
                    key={project.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="text-primary hover:underline">{project.referenceId}</TableCell>
                    <TableCell className="text-primary hover:underline truncate max-w-[150px]">{project.title}</TableCell>
                    <TableCell>{project.department}</TableCell>
                    <TableCell>{project.durationMonths}</TableCell>
                    <TableCell>{project.fundingAgency}</TableCell>
                    <TableCell>{formatCurrency(project.sanctionedBudget)}</TableCell>
                    <TableCell>
                      <span className={cn('font-medium', getStatusColor(project.status))}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell>{project.sanctionedDate}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ProjectsTable;
