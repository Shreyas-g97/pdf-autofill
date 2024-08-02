import React from 'react';
import { TokenGate } from './components/TokenGate';
import { getSession, CopilotData } from '../utils/session';
import FileUploadComponent from './internal/page';
import LogDataButton from './components/LogDataButton';

type SearchParams = { [key: string]: string | string[] | undefined };

export const revalidate = 180;

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const data: CopilotData = await getSession(searchParams);
  console.log({ data });

  return (
    <>
      <main>
        <FileUploadComponent data={data} />
        <LogDataButton data={data} />
      </main>
    </>
  );
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams} />
    </TokenGate>
  );
}

