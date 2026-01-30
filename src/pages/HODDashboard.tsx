import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  LayoutGrid, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockProjects, calculateDashboardStats, calculateAgencyStats } from '@/data/mockData';
import { cn } from '@/lib/utils';

const HODDashboard: React.FC = () => {
  const [selectedPI, setSelectedPI] = useState<string>('all');

  const stats = calculateDashboardStats(mockProjects);
  const agencyStats = calculateAgencyStats(mockProjects);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  // Pie chart data
  const pieData = [
    { name: 'On-Going', value: stats.ongoingProjects, color: 'hsl(199, 89%, 48%)' },
    { name: 'Completed', value: stats.completedProjects, color: 'hsl(24, 95%, 53%)' },
    { name: 'Terminated', value: stats.terminatedProjects, color: 'hsl(0, 72%, 51%)' },
  ];

  // Bar chart data
  const barData = agencyStats.map(agency => ({
    name: agency.agency,
    'Total Projects': agency.total,
    'Completed': agency.completed,
    'Terminated': agency.terminated,
    'On-Going': agency.ongoing,
  }));

  // Recent projects by status
  const recentProjects = {
    completed: mockProjects.filter(p => p.status === 'Completed').slice(0, 3),
    ongoing: mockProjects.filter(p => p.status === 'On-Going').slice(0, 3),
    terminated: mockProjects.filter(p => p.status === 'Terminated').slice(0, 3),
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={selectedPI} onValueChange={setSelectedPI}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select PI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All PIs</SelectItem>
                <SelectItem value="test@test.com">test@test.com</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">Apply</Button>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-chart-4">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number of projects</p>
                <p className="text-xl font-bold text-chart-4">{stats.totalProjects}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-5/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On-going Projects</p>
                <p className="text-xl font-bold">
                  <span className="text-chart-5">{stats.ongoingProjects}</span>
                  <span className="text-muted-foreground text-sm">/{stats.totalProjects}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Projects</p>
                <p className="text-xl font-bold">
                  <span className="text-success">{stats.completedProjects}</span>
                  <span className="text-muted-foreground text-sm">/{stats.totalProjects}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terminated Projects</p>
                <p className="text-xl font-bold">
                  <span className="text-destructive">{stats.terminatedProjects}</span>
                  <span className="text-muted-foreground text-sm">/{stats.totalProjects}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary">Revenue Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Received Budget</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(stats.totalReceived)}</span>
                  <span>{formatCurrency(stats.totalSanctioned)}</span>
                </div>
                <Progress 
                  value={(stats.totalReceived / stats.totalSanctioned) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Received College</span>
                  <span>Budget</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Balance Budget</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(stats.balanceToGet)}</span>
                  <span>{formatCurrency(stats.totalReceived)}</span>
                </div>
                <Progress 
                  value={(stats.balanceToGet / stats.totalReceived) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Received Project</span>
                  <span>Received College</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Available Budget</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(stats.availableBudget)}</span>
                  <span>{formatCurrency(stats.totalReceived)}</span>
                </div>
                <Progress 
                  value={(stats.availableBudget / stats.totalReceived) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Utilized Budget</span>
                  <span>Received Project</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-center">Number of Projects from Agency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total Projects" fill="hsl(0, 72%, 51%)" />
                    <Bar dataKey="Completed" fill="hsl(172, 66%, 50%)" />
                    <Bar dataKey="Terminated" fill="hsl(262, 83%, 40%)" />
                    <Bar dataKey="On-Going" fill="hsl(24, 95%, 53%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-primary">Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Project Status */}
        <Card className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 text-sm">
              <div className="font-medium">📦</div>
              <div className="font-medium">🏛️</div>
              <div className="font-medium">👤</div>
              <div className="font-medium">🕐</div>
              <div className="font-medium">💰</div>
            </div>
            
            {/* Completed */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-center text-muted-foreground">Completed</p>
              {recentProjects.completed.map(project => (
                <div key={project.id} className="grid grid-cols-5 gap-4 text-sm bg-background/50 p-2 rounded">
                  <div className="truncate">{project.title}</div>
                  <div>{project.fundingAgency}</div>
                  <div>{project.piEmail}</div>
                  <div>{project.sanctionedDate}</div>
                  <div>{formatCurrency(project.sanctionedBudget)}</div>
                </div>
              ))}
            </div>

            {/* On-going */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-center text-muted-foreground">On-going</p>
              {recentProjects.ongoing.map(project => (
                <div key={project.id} className="grid grid-cols-5 gap-4 text-sm bg-background/50 p-2 rounded">
                  <div className="truncate">{project.title}</div>
                  <div>{project.fundingAgency}</div>
                  <div>{project.piEmail}</div>
                  <div>{project.sanctionedDate}</div>
                  <div>{formatCurrency(project.sanctionedBudget)}</div>
                </div>
              ))}
            </div>

            {/* Terminated */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-center text-muted-foreground">Terminated</p>
              {recentProjects.terminated.map(project => (
                <div key={project.id} className="grid grid-cols-5 gap-4 text-sm bg-destructive/10 p-2 rounded">
                  <div className="truncate">{project.title}</div>
                  <div>{project.fundingAgency}</div>
                  <div>{project.piEmail}</div>
                  <div>{project.sanctionedDate}</div>
                  <div>{formatCurrency(project.sanctionedBudget)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">ID</th>
                    <th className="text-left p-3 font-medium">Product</th>
                    <th className="text-left p-3 font-medium">Product</th>
                    <th className="text-left p-3 font-medium">Depar...</th>
                    <th className="text-left p-3 font-medium">Agency</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Sanct...</th>
                    <th className="text-left p-3 font-medium">Progress in Budget</th>
                    <th className="text-left p-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProjects.map((project, idx) => (
                    <tr key={project.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 truncate max-w-[150px]">{project.title}</td>
                      <td className="p-3"></td>
                      <td className="p-3">{project.department}</td>
                      <td className="p-3">{project.fundingAgency}</td>
                      <td className="p-3">
                        <span className={cn(
                          project.status === 'Completed' && 'text-success',
                          project.status === 'On-Going' && 'text-success',
                          project.status === 'Terminated' && 'text-destructive'
                        )}>
                          {project.status}
                        </span>
                      </td>
                      <td className="p-3">₹ {formatCurrency(project.sanctionedBudget)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div 
                              className={cn(
                                "h-full",
                                project.utilizedBudget >= project.sanctionedBudget 
                                  ? "bg-destructive" 
                                  : "bg-success"
                              )}
                              style={{ width: `${Math.min((project.utilizedBudget / project.sanctionedBudget) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            ₹{formatCurrency(project.utilizedBudget)}/{formatCurrency(project.sanctionedBudget)}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">{project.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HODDashboard;
