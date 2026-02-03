import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useMemo,
  useState,
} from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type Session } from "@supabase/supabase-js";
import { Button } from "../components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export type LoginFormProp = {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
};

export function LoginForm({ session, setSession }: LoginFormProp) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState<"Sign Up" | "Sign In">("Sign In");

  const isSignUp = useMemo(() => {
    return action === "Sign Up";
  }, [action]);

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }

    setSession(data.session);
    // check whether email confirmation is needed
    //
    // If Confirm email is enabled, a user is returned but session is null.
    // If Confirm email is disabled, both a user and a session are returned.
    if (data.session === null && data.user !== null) {
      alert("Please confirm your email to finish registration!");
    }
    setLoading(false);
  };

  const handleSignInWithPassword = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    }
    setSession(data.session);
    setLoading(false);
  };

  if (session) {
    return null;
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-3/5 w-4/5 bg-gray-300 shadow-sm shadow-gray-500 rounded-2xl py-4 ">
      <div className="flex flex-col gap-4 w-full items-center justify-between relative m-auto py-4 px-8">
        <div className="w-full flex flex-row items-center justify-between">
          <h1 className="font-medium text-lg line-clamp-1 text-ellipsis break-all">
            {action}
          </h1>
        </div>

        <form
          className="w-full"
          onSubmit={isSignUp ? handleSignUp : handleSignInWithPassword}
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  type="email"
                  placeholder="xxx@example.com"
                  value={email}
                  required={true}
                  className="border-black"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {isSignUp
                  ? (
                    <FieldDescription>
                      Must be at least 6 characters long.
                    </FieldDescription>
                  )
                  : null}
                <Input
                  type="password"
                  value={password}
                  required={true}
                  className="border-black"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <FieldGroup>
                <Field orientation="horizontal" className="w-full">
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Loading" : action}
                  </Button>
                </Field>
                <Field orientation="horizontal" className="w-full">
                  <Button
                    variant="link"
                    type="button"
                    className="w-full cursor-pointer text-blue-800 underline"
                    disabled={loading}
                    onClick={() => setAction(isSignUp ? "Sign In" : "Sign Up")}
                  >
                    {isSignUp
                      ? "Already Have an account? Sign In"
                      : "Don't have an account? Sign Up"}
                  </Button>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </div>
  );
}
