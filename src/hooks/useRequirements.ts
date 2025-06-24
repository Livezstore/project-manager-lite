import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Requirement } from '@/types';

export function useRequirements() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fromSupabaseRequirement = (row: any): Requirement => ({
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description ?? '',
    status: row.status,
    priority: row.priority,
    notes: row.notes ?? '',
    createdAt: row.created_at,
  });

  const toSupabaseRequirement = (data: Partial<Requirement>, userId: string) => ({
    project_id: data.projectId,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    notes: data.notes,
    user_id: userId,
  });

  const fetchRequirements = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequirements((data || []).map(fromSupabaseRequirement));
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to load requirements.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequirements(); }, [user]);

  const createRequirement = async (reqData: Omit<Requirement, 'id' | 'createdAt'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('requirements')
        .insert([toSupabaseRequirement(reqData, user.id)])
        .select()
        .single();
      if (error) throw error;
      const requirement = fromSupabaseRequirement(data);
      setRequirements(prev => [requirement, ...prev]);
      toast({ title: 'Success!', description: 'Requirement created.' });
      return requirement;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to create requirement.', variant: 'destructive' });
    }
  };

  const updateRequirement = async (id: string, updates: Partial<Requirement>) => {
    try {
      const { data, error } = await supabase
        .from('requirements')
        .update({ ...toSupabaseRequirement(updates, user?.id), updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();
      if (error) throw error;
      const requirement = fromSupabaseRequirement(data);
      setRequirements(prev => prev.map(r => r.id === id ? requirement : r));
      toast({ title: 'Success!', description: 'Requirement updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update requirement.', variant: 'destructive' });
    }
  };

  const deleteRequirement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('requirements')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      if (error) throw error;
      setRequirements(prev => prev.filter(r => r.id !== id));
      toast({ title: 'Success!', description: 'Requirement deleted.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete requirement.', variant: 'destructive' });
    }
  };

  return { requirements, loading, createRequirement, updateRequirement, deleteRequirement, refetch: fetchRequirements };
}
