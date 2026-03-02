import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({ title: 'Login successful', description: 'Welcome to the Revenue Monitoring Portal' });
        navigate('/home');
      } else {
        toast({ title: 'Login failed', description: 'Invalid email or password', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred during login', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary-foreground/10 border-2 border-primary-foreground/30 flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">SIST</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary-foreground tracking-wide">SATHYABAMA</h1>
            <p className="text-sm text-primary-foreground/80 uppercase tracking-wider">Institute of Science and Technology</p>
            <p className="text-xs text-primary-foreground/60 uppercase">(Deemed to be University)</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center bg-muted/30 p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-2">
            <h2 className="text-2xl font-bold text-primary">Revenue Monitoring Portal</h2>
            <p className="text-sm text-muted-foreground">Sign in to manage your projects</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
                    value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                {isLoading ? 'Signing in...' : (<><LogIn className="mr-2 h-4 w-4" />Sign In</>)}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Contact your administrator to get login credentials.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-primary py-3 text-center">
        <p className="text-xs text-primary-foreground/70">
          © 2024 Sathyabama Institute of Science and Technology. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Login;
