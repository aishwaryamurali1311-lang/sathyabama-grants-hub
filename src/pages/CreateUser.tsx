import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ROLE_HIERARCHY: Record<string, { value: string; label: string }[]> = {
  superadmin: [{ value: 'admin', label: 'Department Admin (HOD)' }],
  admin: [{ value: 'pi', label: 'Principal Investigator' }],
  pi: [
    { value: 'co_pi', label: 'Co-Principal Investigator' },
    { value: 'jrf', label: 'JRF' },
    { value: 'assistant', label: 'Project Assistant' },
  ],
  co_pi: [
    { value: 'assistant', label: 'Assistant' },
    { value: 'jrf', label: 'JRF' },
    { value: 'student', label: 'Student' },
  ],
};

const CreateUser: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: '', department_id: '', mobile_number: '', project_id: '',
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await supabase.from('departments').select('*').is('deleted_at', null);
      return data ?? [];
    },
  });

  // Fetch projects that the current user has access to (for PI/Co-PI assigning team members)
  const { data: projects } = useQuery({
    queryKey: ['my_projects'],
    enabled: profile?.role === 'pi' || profile?.role === 'co_pi',
    queryFn: async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, title, reference_id')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const allowedRoles = profile ? (ROLE_HIERARCHY[profile.role] || []) : [];

  // Show project selector when PI/Co-PI creates sub-roles
  const showProjectSelector = (profile?.role === 'pi' || profile?.role === 'co_pi') && 
    ['co_pi', 'jrf', 'assistant', 'student'].includes(formData.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.functions.invoke('create-user', {
      body: formData,
    });

    setIsLoading(false);

    if (error || data?.error) {
      const rawMsg = data?.error || error?.message || 'Failed to create user';
      const friendlyMsg = rawMsg.includes('already been registered')
        ? 'A user with this email already exists. Please use a different email.'
        : rawMsg;
      toast({ title: 'Error', description: friendlyMsg, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `User ${formData.name} created successfully` });
      setFormData({ name: '', email: '', password: '', role: '', department_id: '', mobile_number: '', project_id: '' });
    }
  };

  if (allowedRoles.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-12 text-muted-foreground">
          <p>You do not have permission to create users.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <UserPlus className="h-5 w-5" />Create User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} required minLength={8} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={v => setFormData(p => ({ ...p, role: v, project_id: '' }))}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {allowedRoles.map(r => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {profile?.role === 'superadmin' && (
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={formData.department_id} onValueChange={v => setFormData(p => ({ ...p, department_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {(departments ?? []).map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name} - {d.description}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {showProjectSelector && (
                <div className="space-y-2">
                  <Label>Assign to Project</Label>
                  <Select value={formData.project_id} onValueChange={v => setFormData(p => ({ ...p, project_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select project (optional)" /></SelectTrigger>
                    <SelectContent>
                      {(projects ?? []).map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title} ({p.reference_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Optionally assign this user to a project as a team member.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input value={formData.mobile_number} onChange={e => setFormData(p => ({ ...p, mobile_number: e.target.value }))} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !formData.role}>
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateUser;
