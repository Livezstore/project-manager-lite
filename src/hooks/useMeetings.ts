import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Meeting } from '@/types';

function fromSupabaseMeeting(row: any): Meeting {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    date: row.date,
    time: row.time,
    duration: row.duration,
    status: row.status,
    minutes: row.minutes ?? '',
    participants: Array.isArray(row.participants) ? row.participants : [],
  };
}

function toSupabaseMeeting(data: Partial<Meeting>, userId: string) {
  return {
    project_id: data.projectId,
    title: data.title,
    date: data.date,
    time: data.time,
    duration: data.duration,
    status: data.status,
    minutes: data.minutes,
    participants: data.participants,
    user_id: userId,
  };
}

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMeetings = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      if (error) throw error;
      setMeetings((data || []).map(fromSupabaseMeeting));
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to load meetings.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeetings(); }, [user]);

  const createMeeting = async (meetingData: Omit<Meeting, 'id'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert([toSupabaseMeeting(meetingData, user.id)])
        .select()
        .single();
      if (error) throw error;
      const meeting = fromSupabaseMeeting(data);
      setMeetings(prev => [meeting, ...prev]);
      toast({ title: 'Success!', description: 'Meeting created.' });
      return meeting;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to create meeting.', variant: 'destructive' });
    }
  };

  const updateMeeting = async (id: string, updates: Partial<Meeting>) => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .update({ ...toSupabaseMeeting(updates, user?.id), updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();
      if (error) throw error;
      const meeting = fromSupabaseMeeting(data);
      setMeetings(prev => prev.map(m => m.id === id ? meeting : m));
      toast({ title: 'Success!', description: 'Meeting updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update meeting.', variant: 'destructive' });
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      if (error) throw error;
      setMeetings(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Success!', description: 'Meeting deleted.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete meeting.', variant: 'destructive' });
    }
  };

  return { meetings, loading, createMeeting, updateMeeting, deleteMeeting, refetch: fetchMeetings };
}
