"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { fetchGithubUserInfo } from "../../_actions/fetch-github-user-info.action";

export default function GithubOAuthPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  React.useEffect(() => {
    if (!code) {
      return;
    }

    void fetchGithubUserInfo(code);
  }, [code]);

  return null;
}
