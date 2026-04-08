import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Login() {
  const { login, user } = useAuth();

  if (user) return <div className="flex items-center justify-center h-screen">Redirecting...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-muted/50">
      <div className="p-8 bg-background rounded-xl shadow-lg border w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">LogCentral</h1>
        <p className="text-muted-foreground mb-8">Centralized log monitoring for all your projects.</p>
        <Button onClick={login} className="w-full py-6 text-lg" size="lg">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
