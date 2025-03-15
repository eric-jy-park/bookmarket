import { useGoogleLogin } from '@react-oauth/google';
import { fetchGoogleUserInfo } from '../_actions/fetch-google-user-info.action';
import * as Sentry from '@sentry/nextjs';
import React from 'react';

export const useOAuth = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: codeResponse => {
      void fetchGoogleUserInfo(codeResponse);
    },
    onError: error => Sentry.captureException(error),
  });

  const githubLogin = React.useCallback(() => {
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}&scope=user:email`;
    window.location.href = githubOAuthUrl;
  }, []);

  return { googleLogin, githubLogin };
};
