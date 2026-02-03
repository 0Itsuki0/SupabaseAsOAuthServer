import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "oidc-react";

export default function Home() {
  const auth = useAuth();

  return (
    <>
      <div className="flex flex-col gap-6 items-center justify-center w-full max-w-3xl h-full px-8 py-10 font-mono m-auto overflow-y-scroll overflow-x-hidden">
        <div className="w-full flex flex-row items-center justify-between">
          <h1 className="font-bold text-3xl line-clamp-1 text-ellipsis break-all">
            Itsuki's Client App!
          </h1>
        </div>

        {auth.isLoading ? <>Loading...</> : (
          <>
            <div className="w-fit flex flex-col gap-4 items-center my-8">
              {auth.userData
                ? (
                  <>
                      <div>Email: {auth.userData.profile.email ?? "unknown"}</div>
                      <div>User Id: {auth.userData.profile.sub ?? "unknown"}</div>
                 </>
                )
                : <>No One Signed In Yet!</>}
            </div>

            <Button
              size="icon-sm"
              onClick={() => {
                auth.userData ? auth.signOut() :auth.signIn()
              }}
              className="w-full cursor-pointer max-w-md h-10"
            >
              {auth.userData ? "Sign Out" : "Sign In"}
              {auth.userData ? <LogOut /> : <LogIn />}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
