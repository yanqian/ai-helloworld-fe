import { FormEvent, useState } from 'react';
import { Button } from '@/components/common/Button';
import { TextField } from '@/components/common/TextField';
import type { UVAdviceRequest } from '../types';

interface Props {
  onSubmit: (payload: UVAdviceRequest) => void;
  isLoading: boolean;
}

export const UVAdvisorForm = ({ onSubmit, isLoading }: Props) => {
  const [date, setDate] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(date ? { date } : {});
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <TextField
        label="Target date"
        type="date"
        value={date}
        optional
        onChange={(event) => setDate(event.target.value)}
        onClear={() => setDate('')}
      />
      <p className="text-sm text-slate-600">
        Data comes from <strong>data.gov.sg</strong>. Leave the date empty to use today&apos;s UV
        index in Singapore (UTC+8).
      </p>
      <Button type="submit" isLoading={isLoading}>
        Generate outfit & protection tips
      </Button>
    </form>
  );
};
