import { useEffect, useState } from "react";
import { type Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { LoginForm } from "@/views/LoginForm";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  useEffect(() => {
    console.log("redirect", redirect);
    if (session && redirect) {
      navigate(
        redirect,
      );
      return;
    }
  }, [session]);

  useEffect(() => {
    console.log(redirect);
    if (session && redirect) {
      navigate(
        redirect,
      );
      return;
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 items-center justify-center w-full max-w-3xl h-full px-8 py-10 font-mono m-auto overflow-y-scroll overflow-x-hidden">
        <div className="w-full flex flex-row items-center justify-between">
          <h1 className="font-bold text-3xl line-clamp-1 text-ellipsis break-all">
            Itsuki's OAuth Server!
          </h1>

          <div className="w-fit flex flex-row items-center gap-2">
            {session
              ? (
                <Button
                  size="icon-sm"
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut />
                </Button>
              )
              : null}
          </div>
        </div>
      </div>
      {!session
        ? (
          <LoginForm
            session={session}
            setSession={setSession}
          />
        )
        : (
          <div className="w-full text-center font-bold text-xl line-clamp-1 text-ellipsis break-all py-16">
            Welcome, {session.user.email}!
          </div>
        )}
    </>
  );
}
