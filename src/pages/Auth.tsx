
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin // Ensure the redirect URL is set correctly
          }
        });
        
        if (error) throw error;
        
        // Handle email confirmation
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          toast({
            title: "Email confirmation required",
            description: "Please check your email to confirm your account before signing in.",
          });
          setIsSignUp(false);
          setIsLoading(false);
          return;
        }
        
        // Check if email confirmation is required
        if (data.user?.confirmation_sent_at) {
          toast({
            title: "Email confirmation sent",
            description: "Please check your email to confirm your account before signing in.",
          });
          setIsSignUp(false);
          setIsLoading(false);
          return;
        }
        
        // If no email confirmation required, try to sign in directly
        try {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            toast({
              title: "Account created",
              description: "Your account has been created. Please sign in manually.",
            });
            setIsSignUp(false);
          } else {
            toast({
              title: "Welcome!",
              description: "Your account has been created and you're now signed in.",
            });
            navigate("/");
          }
        } catch (signInError: any) {
          toast({
            title: "Sign in required",
            description: "Account created. Please sign in with your credentials.",
          });
          setIsSignUp(false);
        }
      } else {
        // Regular sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Handle the specific error for unconfirmed emails
          if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email not confirmed",
              description: "Please check your inbox and confirm your email address before signing in.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else if (data.user) {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-white/80">
            {isSignUp
              ? "Sign up to start using our app"
              : "Sign in to your account"}
          </p>
        </div>

        <div className="backdrop-blur-md bg-black/20 p-8 rounded-lg shadow-xl border border-white/10">
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/50 border-white/20 text-white placeholder:text-white/50"
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isSignUp
                ? "Create account"
                : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/80 hover:text-white text-sm"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
