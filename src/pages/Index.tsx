
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPage } from "@/components/AuthPage";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { ProjectsManager } from "@/components/ProjectsManager";
import { RequirementsManager } from "@/components/RequirementsManager";
import { PaymentsManager } from "@/components/PaymentsManager";
import { MeetingsManager } from "@/components/MeetingsManager";
import { ProfilePage } from "@/components/ProfilePage";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectsManager />;
      case 'requirements':
        return <RequirementsManager />;
      case 'payments':
        return <PaymentsManager />;
      case 'meetings':
        return <MeetingsManager />;
      case 'profile':
        return <ProfilePage onBack={() => setActiveView('dashboard')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
