'use client';
import { Poll } from '@/types/poll';
import { httpRequest } from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddPollPage() {
  const [options, setOptions] = useState<string[]>(['', '']);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const parsedData = {
      ...data,
      initialDate: new Date(data.initialDate as string).toISOString(),
      finalDate: new Date(data.finalDate as string).toISOString(),
      options: Object.entries(data)
        .filter(([key]) => key.startsWith('options'))
        .map(([key, value]) => ({
          text: value,
          votes: 0,
        })),
    };
    const response = await httpRequest.post<Poll>('/polls', parsedData);
    router.push(`/`);
  };

  return (
    <div className="flex flex-1 p-12 flex-col gap-12 font-sans">
      <h1 className="text-2xl">Create Poll</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2">
          Title:
          <input type="text" name="title" className="border border-slate-500 rounded-lg p-2" />
        </label>
        <label className="flex flex-col gap-2">
          Initial Date:
          <input type="date" name="initialDate" className="border border-slate-500 rounded-lg p-2" />
        </label>
        <label className="flex flex-col gap-2">
          Final Date:
          <input type="date" name="finalDate" className="border border-slate-500 rounded-lg p-2" />
        </label>
        <div className="flex flex-col gap-2">
          {options.map((option, index) => (
            <label key={index} className="flex flex-col gap-2">
              Option {index + 1}:
              <input type="text" name={`options[${index}].text`} className="border border-slate-500 rounded-lg p-2" />
            </label>
          ))}
          <button
            type="button"
            className="bg-slate-600 text-slate-50 p-2 mt-2 rounded-lg"
            onClick={() => setOptions([...options, ''])}
          >
            Add Option
          </button>
        </div>
        <button type="submit" className="bg-slate-600 text-slate-50 p-2 mt-2 rounded-lg">
          Create Poll
        </button>
      </form>
    </div>
  );
}
