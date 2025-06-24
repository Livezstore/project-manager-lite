import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Payment } from '@/types';

function fromSupabasePayment(row: any): Payment {
  return {
    id: row.id,
    projectId: row.project_id,
    amount: row.amount,
    dateReceived: row.date_received,
    paymentMethod: row.payment_method,
    status: row.status,
    notes: row.notes ?? '',
  };
}

function toSupabasePayment(data: Partial<Payment>, userId: string) {
  return {
    project_id: data.projectId,
    amount: data.amount,
    date_received: data.dateReceived,
    payment_method: data.paymentMethod,
    status: data.status,
    notes: data.notes,
    user_id: userId,
  };
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPayments = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('date_received', { ascending: false });
      if (error) throw error;
      setPayments((data || []).map(fromSupabasePayment));
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to load payments.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [user]);

  const createPayment = async (paymentData: Omit<Payment, 'id'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([toSupabasePayment(paymentData, user.id)])
        .select()
        .single();
      if (error) throw error;
      const payment = fromSupabasePayment(data);
      setPayments(prev => [payment, ...prev]);
      toast({ title: 'Success!', description: 'Payment created.' });
      return payment;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to create payment.', variant: 'destructive' });
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ ...toSupabasePayment(updates, user?.id), updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();
      if (error) throw error;
      const payment = fromSupabasePayment(data);
      setPayments(prev => prev.map(p => p.id === id ? payment : p));
      toast({ title: 'Success!', description: 'Payment updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update payment.', variant: 'destructive' });
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      if (error) throw error;
      setPayments(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success!', description: 'Payment deleted.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete payment.', variant: 'destructive' });
    }
  };

  return { payments, loading, createPayment, updatePayment, deletePayment, refetch: fetchPayments };
}
