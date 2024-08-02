// session.ts
import { copilotApi } from 'copilot-node-sdk';
import { need } from '../utils/need';

type SearchParams = { [key: string]: string | string[] | undefined };

// Define types for each entity
type Workspace = Awaited<ReturnType<typeof copilotApi.prototype.retrieveWorkspace>>;
type Client = Awaited<ReturnType<typeof copilotApi.prototype.retrieveClient>>;
type Company = Awaited<ReturnType<typeof copilotApi.prototype.retrieveCompany>>;
type InternalUser = Awaited<ReturnType<typeof copilotApi.prototype.retrieveInternalUser>>;

export type CopilotData = {
  workspace: Workspace;
  client?: Client;
  company?: Company;
  internalUser?: InternalUser;
};

/**
 * A helper function that instantiates the Copilot SDK and fetches data
 * from the Copilot API based on the contents of the token that gets
 * passed to your app in the searchParams.
 */
export async function getSession(searchParams: SearchParams): Promise<CopilotData> {
  const apiKey = need<string>(
    process.env.COPILOT_API_KEY,
    'COPILOT_API_KEY is required, guide available at: https://docs.copilot.com/docs/custom-apps-setting-up-your-first-app#step-2-register-your-app-and-get-an-api-key',
  );

  const copilot = copilotApi({
    apiKey: apiKey,
    token:
      'token' in searchParams && typeof searchParams.token === 'string'
        ? searchParams.token
        : undefined,
  });

  const data: CopilotData = {
    workspace: await copilot.retrieveWorkspace(),
  };
  const tokenPayload = await copilot.getTokenPayload?.();

  if (tokenPayload?.clientId) {
    data.client = await copilot.retrieveClient({ id: tokenPayload.clientId });
  }
  if (tokenPayload?.companyId) {
    data.company = await copilot.retrieveCompany({
      id: tokenPayload.companyId,
    });
  }
  if (tokenPayload?.internalUserId) {
    data.internalUser = await copilot.retrieveInternalUser({
      id: tokenPayload.internalUserId,
    });
  }

  return data;
}

