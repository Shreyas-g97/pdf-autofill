import React from 'react';
import { TokenGate } from './components/TokenGate';
import { getSession } from '../utils/session';
import FileUploadComponent from './internal/page';
import LogDataButton from './components/LogDataButton';

type SearchParams = { [key: string]: string | string[] | undefined };

export const revalidate = 180;

type PageProps = {
  searchParams: SearchParams;
};

async function Content({ searchParams }: PageProps) {
  const data = await getSession(searchParams);
  
  console.log({ data });

  return (
    <main>
      <FileUploadComponent data={data} />
      <LogDataButton data={data} />
    </main>
  );
}

export default function Page({ searchParams }: PageProps) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams} />
    </TokenGate>
  );
}

