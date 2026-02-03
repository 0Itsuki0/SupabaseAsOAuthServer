// src/pages/OAuthConsent.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import type { OAuthAuthorizationDetails } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

export function OAuthConsent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authorizationId = searchParams.get("authorization_id");

  const [authDetails, setAuthDetails] = useState<
    OAuthAuthorizationDetails | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuthDetails() {
      if (!authorizationId) {
        setError("Missing authorization_id");
        setLoading(false);
        return;
      }

      // Get authorization details using the authorization_id
      // Getting this after getUser sometimes causes 400 error.
      console.log("Fetching auth details for id:", authorizationId);
      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(
        authorizationId,
      );

      if (error) {
        setError(error.message);
      } else {
        console.log("Authorization details:", data);
        // Redirect URL -
        // present if user already consented (can be used to trigger immediate redirect)
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }
        setAuthDetails(data);
      }

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log(window.location.href);
        navigate(
          `/?redirect=oauth/consent?authorization_id=${authorizationId}`,
        );
        return;
      }

      setLoading(false);
    }

    loadAuthDetails();
  }, [authorizationId, navigate]);

  async function handleApprove() {
    if (!authorizationId) return;

    const { data, error } = await supabase.auth.oauth.approveAuthorization(
      authorizationId,
    );

    if (error) {
      setError(error.message);
      return;
    }
    // Redirect to client app
    window.location.href = data.redirect_url;
  }

  async function handleDeny() {
    if (!authorizationId) return;

    const { data, error } = await supabase.auth.oauth.denyAuthorization(
      authorizationId,
    );

    if (error) {
      setError(error.message);
    } else {
      // Redirect to client app with error
      window.location.href = data.redirect_url;
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (authDetails === null) return <div>No authorization request found</div>;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-3/5 w-4/5 bg-gray-300 shadow-sm shadow-gray-500 rounded-2xl py-4 ">
      <div className="flex flex-col gap-4 w-full items-center justify-between relative m-auto py-4 px-8">
        <div className="w-full flex flex-row items-center justify-between">
          <h1 className="font-medium text-lg line-clamp-1 text-ellipsis break-all">
            Authorize {authDetails.client.id} to Access Your Account
          </h1>
        </div>

        <div>
          <div className="w-full flex flex-col gap-4">
            <p>
              <strong>Client:</strong> {authDetails.client.id}
            </p>
            <p>
              <strong>Redirect URI:</strong> {authDetails.redirect_url}
            </p>
            <p>
              <strong>Requested permissions:</strong> {authDetails.scope}
            </p>
          </div>

          <div className="flex flex-row gap-4">
            <Button
              // size="icon-sm"
              onClick={handleApprove}
              className="cursor-pointer"
            >
              Approve
            </Button>

            <Button
              // size="icon-sm"
              onClick={handleDeny}
              className="cursor-pointer"
            >
              Deny
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
