import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/hooks/useProjects";
import { useRequirements } from "@/hooks/useRequirements";
import { usePayments } from "@/hooks/usePayments";
import { FolderOpen, FileText, CreditCard, DollarSign, Eye, EyeOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";

export function Dashboard() {
  const { projects, loading: loadingProjects } = useProjects();
  const { requirements, loading: loadingRequirements } = useRequirements();
  const { payments, loading: loadingPayments } = usePayments();

  const [showEarnings, setShowEarnings] = useState(false);
  const earningsTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleToggleEarnings = () => {
    if (showEarnings) {
      setShowEarnings(false);
      if (earningsTimeout.current) clearTimeout(earningsTimeout.current);
    } else {
      setShowEarnings(true);
      if (earningsTimeout.current) clearTimeout(earningsTimeout.current);
      earningsTimeout.current = setTimeout(() => setShowEarnings(false), 5000);
    }
  };

  if (loadingProjects || loadingRequirements || loadingPayments) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-16 w-full mb-2" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const pendingRequirements = requirements.filter(r => r.status === 'Pending').length;
  const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Planning': return 'bg-yellow-500';
      case 'On Hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Manager</h1>
        <p className="text-gray-600">Welcome back! Here's your project overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {completedProjects} completed this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requirements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequirements}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {showEarnings ? `৳${totalEarnings.toLocaleString()}` : '*****'}
              <button
                className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                onClick={handleToggleEarnings}
                type="button"
                aria-label={showEarnings ? 'Hide earnings' : 'Show earnings'}
              >
                {showEarnings ? <EyeOff className="w-5 h-5 text-blue-600 align-middle" /> : <Eye className="w-5 h-5 text-blue-600 align-middle" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments} payments pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              Total transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.client}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        className={`${getStatusColor(project.status)} text-white`}
                      >
                        {project.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold flex items-center gap-2">
                      {showEarnings ? `৳${project.budget.toLocaleString()}` : '*****'}
                      <button
                        className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                        onClick={handleToggleEarnings}
                        type="button"
                        aria-label={showEarnings ? 'Hide budget' : 'Show budget'}
                      >
                        {showEarnings ? <EyeOff className="w-5 h-5 text-blue-600 align-middle" /> : <Eye className="w-5 h-5 text-blue-600 align-middle" />}
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requirements.slice(0, 4).map((req) => {
                const project = projects.find(p => p.id === req.projectId);
                return (
                  <div key={req.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{req.title}</h4>
                      <p className="text-sm text-gray-600">{project?.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={getPriorityColor(req.priority)}>
                          {req.priority}
                        </Badge>
                        <Badge variant="outline">
                          {req.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
