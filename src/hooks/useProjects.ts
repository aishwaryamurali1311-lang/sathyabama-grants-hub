import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, departments(name), profiles!projects_pi_id_fkey(name, email)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useProject = (id: string | undefined) => {
  return useQuery({
    queryKey: ['project', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, departments(name), profiles!projects_pi_id_fkey(name, email)')
        .eq('id', id!)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useProjectDocuments = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['project_years', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_years')
        .select('*')
        .eq('project_id', projectId!)
        .is('deleted_at', null)
        .order('year', { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useProjectTeam = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['team_members', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*, profiles(name, email, mobile_number, department_id, departments(name))')
        .eq('project_id', projectId!)
        .is('removed_at', null);

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useProjectActivities = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['activity_logs', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('project_id', projectId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useReportRequests = () => {
  return useQuery({
    queryKey: ['report_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_requests')
        .select('*, projects(title)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useDashboardStats = () => {
  const { data: projects, ...rest } = useProjects();

  const stats = projects ? {
    totalProjects: projects.length,
    ongoingProjects: projects.filter(p => p.status === 'on_going').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    terminatedProjects: projects.filter(p => p.status === 'terminated').length,
    totalSanctioned: projects.reduce((s, p) => s + Number(p.sanctioned_budget), 0),
    totalReceived: projects.reduce((s, p) => s + Number(p.received_budget), 0),
    totalUtilized: projects.reduce((s, p) => s + Number(p.utilized_budget), 0),
    balanceToGet: projects.reduce((s, p) => s + Number(p.sanctioned_budget) - Number(p.received_budget), 0),
    availableBudget: projects.reduce((s, p) => s + Number(p.received_budget) - Number(p.utilized_budget), 0),
  } : null;

  const agencyStats = projects ? (() => {
    const agencies = [...new Set(projects.map(p => p.funding_agency))];
    return agencies.map(agency => {
      const ap = projects.filter(p => p.funding_agency === agency);
      return {
        agency,
        total: ap.length,
        completed: ap.filter(p => p.status === 'completed').length,
        terminated: ap.filter(p => p.status === 'terminated').length,
        ongoing: ap.filter(p => p.status === 'on_going').length,
      };
    });
  })() : [];

  return { projects, stats, agencyStats, ...rest };
};
