import React, { useState } from 'react';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { isValidEmail } from '../../utils/store';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setStatus('submitting');
    window.setTimeout(() => setStatus('success'), 800);
  };

  if (status === 'success') {
    return (
      <p role="status" className="flex items-start gap-3 text-sm text-ivory/85">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal">
          <CheckIcon className="h-4 w-4" />
        </span>
        Thank you! Sign-ups aren’t connected to a mailing service in this demo, so your email wasn’t stored.
      </p>);

  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="Your email address"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'newsletter-error' : undefined}
          className="h-12 flex-1 rounded-full border border-ivory/20 bg-ivory/5 px-5 text-sm text-ivory placeholder:text-ivory/45 focus:border-gold focus:outline-none" />
        
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gold px-6 text-sm font-semibold text-charcoal transition-colors duration-150 hover:bg-gold-light disabled:opacity-70">
          
          {status === 'submitting' && <Loader2Icon className="h-4 w-4 animate-spin" />}
          Subscribe
        </button>
      </div>
      {error &&
      <p id="newsletter-error" className="mt-2 text-xs text-gold-light">
          {error}
        </p>
      }
    </form>);

}