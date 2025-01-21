'use client';
import { Poll } from '@/types/poll';
import { httpRequest } from '@/utils/axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function PollPage() {
  const { id: pollId } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll>();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    httpRequest.get<Poll>(`/polls/${pollId}`).then((response) => {
      setPoll(response.data);
    });
    const clientSocket = io('http://localhost:8080');
    setSocket(clientSocket);
    clientSocket.on('receive_vote', (data: string) => {
      setPoll(JSON.parse(data));
    });

    return () => {
      clientSocket.disconnect();
    };
  }, [pollId]);

  const handleVote = (optionId: number) => {
    socket?.emit('vote', { pollId, optionId });
  };

  const disabled =
    new Date(poll?.finalDate).getTime() < new Date().getTime() ||
    new Date(poll?.initialDate).getTime() > new Date().getTime();

  return poll ? (
    <div className="flex flex-1 p-12 flex-col gap-10 font-sans items-center">
      <h1 className="text-2xl">{poll.title}</h1>
      <div className="flex flex-col items-center gap-6 w-full">
        {poll.options.map((option) => (
          <div className="flex flex-col gap-2 w-1/2 items-center" key={option.id}>
            <button
              className="disabled:bg-slate-300 bg-slate-100 rounded-lg border border-slate-300 p-4 w-full text-center"
              onClick={() => handleVote(option.id)}
              disabled={disabled}
            >
              {option.text}
            </button>
            <p>Votes: {option.votes}</p>
          </div>
        ))}
      </div>
      <div>
        <h3>
          {' '}
          <strong>Total Votes:</strong> {poll.options.reduce((acc, option) => acc + option.votes, 0)}
        </h3>
        <p>
          <strong>Start Date:</strong> {new Date(poll.initialDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong> {new Date(poll.finalDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
}
