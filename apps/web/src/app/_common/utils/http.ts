import ky from "ky";

const options = {
  timeout: 30000,
  retry: 2,
  hooks: {
    beforeRetry: [
      async ({ error }: { error: Error }) =>
        console.log(`Retrying due to: ${error?.message}`),
    ],
  },
};

export const http = ky.create(options);
