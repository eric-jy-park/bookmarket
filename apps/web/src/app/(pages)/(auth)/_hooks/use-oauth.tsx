import { useGoogleLogin } from "@react-oauth/google";
import { fetchGoogleUserInfo } from "../_actions/fetch-google-user-info.action";
import * as Sentry from "@sentry/nextjs";

export const useOAuth = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      void fetchGoogleUserInfo(codeResponse);
    },
    onError: (error) => Sentry.captureException(error),
  });

  return { googleLogin };
};
