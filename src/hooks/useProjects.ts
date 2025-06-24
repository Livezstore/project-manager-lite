import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  name: string;
  client: string;
  client_email?: string;
  client_phone?: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  start_date: string;
  deadline: string;
  budget: number;
  description: string;
  created_at: string;
}

// Mapping functions
function fromSupabaseProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    client: row.client,
    client_email: row.client_email ?? '',
    client_phone: row.client_phone ?? '',
    status: row.status,
    start_date: row.start_date,
    deadline: row.deadline,
    budget: row.budget,
    description: row.description ?? '',
    created_at: row.created_at,
  };
}

function toSupabaseProject(data: Partial<Project>, userId: string) {
  return {
    name: data.name,
    client: data.client,
    client_email: data.client_email,
    client_phone: data.client_phone,
    status: data.status,
    start_date: data.start_date,
    deadline: data.deadline,
    budget: data.budget,
    description: data.description,
    user_id: userId,
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []).map(fromSupabaseProject));
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([toSupabaseProject(projectData, user.id)])
        .select()
        .single();

      if (error) throw error;
      const project = fromSupabaseProject(data);
      setProjects(prev => [project, ...prev]);
      toast({
        title: "Success!",
        description: "Project created successfully.",
      });
      
      return project;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive",
      });
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...toSupabaseProject(updates, user?.id), updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      const project = fromSupabaseProject(data);
      setProjects(prev => prev.map(p => p.id === id ? project : p));
      toast({
        title: "Success!",
        description: "Project updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success!",
        description: "Project deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
}
