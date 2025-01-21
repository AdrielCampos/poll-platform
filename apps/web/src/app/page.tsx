'use client';
import { useEffect, useState } from 'react';
import { Poll } from './components/poll';
import { Poll as PollType } from '@/types/poll';
import { httpRequest } from '@/utils/axios';
import Link from 'next/link';

export default function Home() {
  const [polls, setPolls] = useState<PollType[]>([]);

  useEffect(() => {
    httpRequest.get<PollType[]>('/polls').then((response) => {
      setPolls(response.data);
    });
  }, []);

  return (
    <div className="flex flex-1 p-12 flex-col gap-12 font-sans">
      <h1 className="text-xl font-medium">Poll Platform</h1>
      <div className="flex flex-row flex-wrap gap-6">
        {polls.map((poll) => (
          <Poll key={poll.id} {...poll} initialDate={new Date(poll.initialDate)} finalDate={new Date(poll.finalDate)} />
        ))}
      </div>
      <Link href="/add-poll" className="absolute bottom-10 right-10 bg-slate-600 text-slate-50 p-4 rounded-lg w-fit">
        + Add Poll
      </Link>
    </div>
  );
}
