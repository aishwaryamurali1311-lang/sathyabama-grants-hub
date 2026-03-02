import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LayoutGrid, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardStats } from '@/hooks/useProjects';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const statusMap: Record<string, string> = {
  on_going: 'On-Going', completed: 'Completed', terminated: 'Terminated',
};

const HODDashboard: React.FC = () => {
  const [selectedPI, setSelectedPI] = useState<string>('all');
  const { projects, stats, agencyStats, isLoading } = useDashboardStats();

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN').format(amount);

  if (isLoading || !stats) {
    return (
      <MainLayout>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      </MainLayout>
    );
  }

  const pieData = [
    { name: 'On-Going', value: stats.ongoingProjects, color: 'hsl(199, 89%, 48%)' },
    { name: 'Completed', value: stats.completedProjects, color: 'hsl(24, 95%, 53%)' },
    { name: 'Terminated', value: stats.terminatedProjects, color: 'hsl(0, 72%, 51%)' },
  ];

  const barData = agencyStats.map(agency => ({
    name: agency.agency,
    'Total Projects': agency.total,
    'Completed': agency.completed,
    'Terminated': agency.terminated,
    'On-Going': agency.ongoing,
  }));

  const recentProjects = {
    completed: (projects ?? []).filter(p => p.status === 'completed').slice(0, 3),
    ongoing: (projects ?? []).filter(p => p.status === 'on_going').slice(0, 3),
    terminated: (projects ?? []).filter(p => p.status === 'terminated').slice(0, 3),
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
              </SelectContent>
            </Select>
            <Button size="sm">Apply</Button>
          </div>
          <Button variant="ghost" size="icon"><Filter className="h-4 w-4" /></Button>
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
                <Progress value={stats.totalSanctioned > 0 ? (stats.totalReceived / stats.totalSanctioned) * 100 : 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Balance Budget</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(stats.balanceToGet)}</span>
                  <span>{formatCurrency(stats.totalReceived)}</span>
                </div>
                <Progress value={stats.totalReceived > 0 ? (stats.balanceToGet / stats.totalReceived) * 100 : 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Available Budget</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(stats.availableBudget)}</span>
                  <span>{formatCurrency(stats.totalReceived)}</span>
                </div>
                <Progress value={stats.totalReceived > 0 ? (stats.availableBudget / stats.totalReceived) * 100 : 0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-primary">Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}>
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
            {(['completed', 'ongoing', 'terminated'] as const).map(status => (
              <div key={status} className="mt-4 space-y-2">
                <p className="text-sm font-medium text-center text-muted-foreground capitalize">{statusMap[status === 'ongoing' ? 'on_going' : status]}</p>
                {recentProjects[status].map(project => (
                  <div key={project.id} className={cn(
                    "grid grid-cols-5 gap-4 text-sm p-2 rounded",
                    status === 'terminated' ? 'bg-destructive/10' : 'bg-background/50'
                  )}>
                    <div className="truncate">{project.title}</div>
                    <div>{project.funding_agency}</div>
                    <div>{(project.profiles as any)?.email}</div>
                    <div>{project.sanctioned_date}</div>
                    <div>{formatCurrency(Number(project.sanctioned_budget))}</div>
                  </div>
                ))}
              </div>
            ))}
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
                    <th className="text-left p-3 font-medium">Title</th>
                    <th className="text-left p-3 font-medium">Department</th>
                    <th className="text-left p-3 font-medium">Agency</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Sanctioned</th>
                    <th className="text-left p-3 font-medium">Progress in Budget</th>
                    <th className="text-left p-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {(projects ?? []).map((project, idx) => (
                    <tr key={project.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 truncate max-w-[150px]">{project.title}</td>
                      <td className="p-3">{(project.departments as any)?.name}</td>
                      <td className="p-3">{project.funding_agency}</td>
                      <td className="p-3">
                        <span className={cn(
                          project.status === 'completed' && 'text-success',
                          project.status === 'on_going' && 'text-success',
                          project.status === 'terminated' && 'text-destructive'
                        )}>
                          {statusMap[project.status] || project.status}
                        </span>
                      </td>
                      <td className="p-3">₹ {formatCurrency(Number(project.sanctioned_budget))}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={cn("h-full", Number(project.utilized_budget) >= Number(project.sanctioned_budget) ? "bg-destructive" : "bg-success")}
                              style={{ width: `${Math.min((Number(project.utilized_budget) / Number(project.sanctioned_budget)) * 100, 100)}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            ₹{formatCurrency(Number(project.utilized_budget))}/{formatCurrency(Number(project.sanctioned_budget))}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">{project.duration_months}m</td>
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
