import { Poll as PollProps } from '@/types/poll';
import Link from 'next/link';

export const Poll = (props: PollProps) => {
  return (
    <Link
      href={`/poll/${props.id}`}
      className="cursor-pointer hover:bg-slate-300 transition-colors flex flex-col gap-5 flex-1 bg-slate-100 border border-slate-500 rounded-lg p-4"
    >
      <h3>{props.title}</h3>
      <div>
        <p>Start Date: {props.initialDate.toLocaleDateString()}</p>
        <p>End Date: {props.finalDate.toLocaleDateString()}</p>
      </div>
    </Link>
  );
};
