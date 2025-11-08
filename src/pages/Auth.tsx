import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to home - demo user auto-login is handled by useAuth hook
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading workspace...</p>
      </div>
    </div>
  );
}
