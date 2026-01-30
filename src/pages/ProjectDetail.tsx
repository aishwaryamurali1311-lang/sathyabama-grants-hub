import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Building2, 
  GraduationCap, 
  IndianRupee, 
  Calendar, 
  Clock,
  Download,
  FileText,
  UserPlus,
  Trash2,
  Check,
  File
} from 'lucide-react';
import { mockProjects, mockDocuments, mockTeamMembers, mockActivities } from '@/data/mockData';
import { cn } from '@/lib/utils';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = mockProjects.find(p => p.id === id);
  const documents = mockDocuments.filter(d => d.projectId === id);
  const teamMembers = mockTeamMembers.filter(t => t.projectId === id);
  const activities = mockActivities.filter(a => a.projectId === id);

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Project not found</p>
          <Button onClick={() => navigate('/home')} className="mt-4">
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const balanceToGet = project.sanctionedBudget - project.receivedBudget;
  const availableBudget = project.receivedBudget - project.utilizedBudget;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-foreground text-background';
      case 'On-Going':
        return 'bg-success text-success-foreground';
      case 'Terminated':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const investigators = teamMembers.filter(t => t.type === 'investigator');
  const manpower = teamMembers.filter(t => t.type === 'manpower');

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-primary">{project.title}</h1>
          <p className="text-sm text-muted-foreground"># {project.referenceId}</p>
          <Badge className={getStatusBadgeClass(project.status)}>
            {project.status}
          </Badge>
        </div>

        {/* Project Info Grid */}
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-5 divide-x">
              <div className="p-4 flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{project.fundingAgency}</span>
              </div>
              <div className="p-4 flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{project.department}</span>
              </div>
              <div className="p-4 flex items-center gap-3">
                <IndianRupee className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{formatCurrency(project.sanctionedBudget)}</span>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{project.sanctionedDate}</span>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{project.duration}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary">Budget Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Utilized Budget:</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  <span className="text-sm font-medium">{formatCurrency(project.utilizedBudget)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Received Budget:</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  <span className="text-sm font-medium">{formatCurrency(project.receivedBudget)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Balance to get:</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  <span className="text-sm font-medium">{formatCurrency(balanceToGet)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Available budget:</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  <span className={cn('text-sm font-medium', availableBudget < 0 ? 'text-destructive' : '')}>
                    {formatCurrency(availableBudget)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-primary">Project Documents</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <File className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Year</TableHead>
                  <TableHead>Release Order</TableHead>
                  <TableHead>Sanction Letter</TableHead>
                  <TableHead>Utilization Certificates</TableHead>
                  <TableHead>Fund</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.year}</TableCell>
                    <TableCell>
                      {doc.releaseOrder ? (
                        <Button variant="default" size="sm" className="h-7 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Attachment
                        </Button>
                      ) : (
                        <span className="text-destructive text-sm">No Attachment</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.sanctionLetter ? (
                        <Button variant="default" size="sm" className="h-7 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Attachment
                        </Button>
                      ) : (
                        <span className="text-destructive text-sm">No Attachment</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.utilizationCertificate ? (
                        <Button variant="default" size="sm" className="h-7 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Attachment
                        </Button>
                      ) : (
                        <span className="text-destructive text-sm">No Attachment</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {formatCurrency(doc.fund)}
                      </div>
                    </TableCell>
                    <TableCell>{doc.remarks}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No documents uploaded yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-primary">Team</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <UserPlus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-secondary/50">Name</TableHead>
                  <TableHead className="bg-secondary/50">Email</TableHead>
                  <TableHead className="bg-secondary/50">Role</TableHead>
                  <TableHead className="bg-secondary/50">Department</TableHead>
                  <TableHead className="bg-secondary/50">Stipend</TableHead>
                  <TableHead className="bg-secondary/50">Mobile Number</TableHead>
                  <TableHead className="bg-secondary/50">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investigators.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/50 text-center font-medium py-2">
                        Investigators
                      </TableCell>
                    </TableRow>
                    {investigators.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {member.stipend}
                          </div>
                        </TableCell>
                        <TableCell>{member.mobileNumber}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
                {manpower.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/50 text-center font-medium py-2">
                        Man Power
                      </TableCell>
                    </TableRow>
                    {manpower.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {formatCurrency(member.stipend)}
                          </div>
                        </TableCell>
                        <TableCell>{member.mobileNumber}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
                {teamMembers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No team members added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-primary">Activites</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-secondary/50">Type</TableHead>
                  <TableHead className="bg-secondary/50">Report</TableHead>
                  <TableHead className="bg-secondary/50">Revenue Information</TableHead>
                  <TableHead className="bg-secondary/50">Recurring</TableHead>
                  <TableHead className="bg-secondary/50">
                    <Clock className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="bg-secondary/50">Attachment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.type}</TableCell>
                    <TableCell>{activity.report}</TableCell>
                    <TableCell>
                      {activity.amount !== undefined && (
                        <div className={cn(
                          'inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-medium',
                          activity.amount >= 0 ? 'revenue-positive' : 'revenue-negative'
                        )}>
                          <IndianRupee className="h-3 w-3" />
                          {formatCurrency(Math.abs(activity.amount))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {activity.isRecurring && <Check className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(activity.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className="text-destructive text-sm">No Attachment</span>
                    </TableCell>
                  </TableRow>
                ))}
                {activities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No activities recorded yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
