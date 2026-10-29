import React, { useState } from 'react';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { isValidEmail } from '../../utils/store';

type Fields = {name: string;email: string;message: string;};
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Please share your name.';
  if (!f.email.trim()) e.email = 'Please enter your email.';else
  if (!isValidEmail(f.email)) e.email = 'That email doesn’t look right.';
  if (f.message.trim().length < 10) e.message = 'Please write at least 10 characters.';
  return e;
}

const input =
'mt-1.5 w-full rounded-xl border bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors duration-150 focus:border-maroon focus:outline-none focus:ring-2 focus:ring-maroon/15';

export function ContactForm() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus('submitting');
    window.setTimeout(() => setStatus('success'), 900);
  };

  if (status === 'success') {
    return (
      <div role="status" className="rounded-2xl bg-parchment p-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald text-ivory">
          <CheckIcon className="h-5 w-5" />
        </span>
        <p className="mt-4 font-display text-2xl text-charcoal">Thank you, {fields.name.split(' ')[0]}.</p>
        <p className="mt-1 text-sm text-charcoal/70">
          Your message passed validation. This demo isn’t connected to an inbox yet, so nothing was sent.
        </p>
        <button
          type="button"
          onClick={() => {
            setFields({ name: '', email: '', message: '' });
            setStatus('idle');
          }}
          className="mt-5 text-sm font-medium text-maroon underline-offset-4 hover:underline">
          
          Write another message
        </button>
      </div>);

  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {(['name', 'email'] as const).map((key) =>
      <div key={key}>
          <label htmlFor={`contact-${key}`} className="text-sm font-medium text-charcoal">
            {key === 'name' ? 'Name' : 'Email'}
          </label>
          <input
          id={`contact-${key}`}
          type={key === 'email' ? 'email' : 'text'}
          autoComplete={key}
          value={fields[key]}
          onChange={update(key)}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `contact-${key}-error` : undefined}
          className={`${input} ${errors[key] ? 'border-maroon' : 'border-charcoal/15'}`} />
        
          {errors[key] &&
        <p id={`contact-${key}-error`} className="mt-1.5 text-xs text-maroon">
              {errors[key]}
            </p>
        }
        </div>
      )}
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-charcoal">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={fields.message}
          onChange={update('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${input} resize-none ${errors.message ? 'border-maroon' : 'border-charcoal/15'}`} />
        
        {errors.message &&
        <p id="contact-message-error" className="mt-1.5 text-xs text-maroon">
            {errors.message}
          </p>
        }
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory transition-colors duration-150 hover:bg-maroon disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon">
        
        {status === 'submitting' && <Loader2Icon className="h-4 w-4 animate-spin" />}
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>);

}