import React from 'react';
import Image from 'next/image';
import { TokenGate } from './components/TokenGate';
import { getSession } from '../utils/session';
import axios from 'axios';
import { useRef } from 'react';
import FileUploadComponent from './internal/page';


type SearchParams = { [key: string]: string | string[] | undefined };

/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const data = await getSession(searchParams);
  
  console.log({ data });
  return (
    <main>
        <FileUploadComponent/>
    </main>
  );
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams} />
    </TokenGate>
  );
}
