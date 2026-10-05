'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '');

const MAX_URL_LENGTH = 2048;
const SLOW_AFTER_MS = 6000;
const TIMEOUT_MS = 90000;

type Status = 'idle' | 'loading' | 'done' | 'error';

function normalizeUrl(value: string): string {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
}

function validateUrl(value: string): string | null {
  if (!value) return 'Paste a link first.';
  if (value.length > MAX_URL_LENGTH) {
    return `That link is too long. The limit is ${MAX_URL_LENGTH} characters.`;
  }

  try {
    const { protocol, hostname } = new URL(value);
    if (protocol !== 'http:' && protocol !== 'https:') {
      return 'Only http:// and https:// links can be shortened.';
    }
    if (!hostname.includes('.') && hostname !== 'localhost') {
      return "That doesn't look like a valid link.";
    }
  } catch {
    return "That doesn't look like a valid link.";
  }

  return null;
}

async function readError(res: Response): Promise<string> {
  if (res.status === 429) {
    return 'Too many requests. Give it a minute and try again.';
  }

  if (res.status === 400) {
    const body = (await res.json().catch(() => null)) as {
      errors?: { url?: string[] };
    } | null;
    return body?.errors?.url?.[0] ?? "That doesn't look like a valid link.";
  }

  return `Something went wrong on our side (error ${res.status}). Please try again.`;
}

export function Shortener() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [slow, setSlow] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const raw = url.trim();
    const target = raw ? normalizeUrl(raw) : '';
    const problem = validateUrl(target);

    if (problem) {
      setError(problem);
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError('');
    setShortUrl('');
    setCopied(false);

    const controller = new AbortController();
    const slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    const abortTimer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(await readError(res));

      const data = (await res.json()) as { shortenedUrl: string };
      setShortUrl(data.shortenedUrl);
      setStatus('done');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('The server took too long to answer. Please try again.');
      } else if (err instanceof TypeError) {
        setError(
          "Couldn't reach the server. Check your connection and try again.",
        );
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
      setStatus('error');
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(abortTimer);
      setSlow(false);
    }
  }

  async function handleCopy() {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      resultRef.current?.select();
      document.execCommand('copy');
    }
    setCopied(true);
  }

  const loading = status === 'loading';

  return (
    <section className="card">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="long-url" className="label">
          Long URL
        </label>
        <div className="row">
          <input
            id="long-url"
            className="input"
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="https://example.com/a/very/long/link"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={loading}
            aria-invalid={status === 'error'}
            aria-describedby="status"
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Shortening…' : 'Shorten'}
          </button>
        </div>
      </form>

      <div id="status" className="status" aria-live="polite">
        {loading && (
          <div className="loading">
            <span className="spinner" aria-hidden="true" />
            <div>
              <p>Hang tight, our monkeys are working on your short URL…</p>
              {slow && (
                <p className="hint">
                  The server is waking up from a nap. This can take up to a
                  minute.
                </p>
              )}
            </div>
          </div>
        )}
        {status === 'error' && <p className="error">{error}</p>}
      </div>

      <label htmlFor="short-url" className="label">
        Short URL
      </label>
      <div className="row">
        <input
          id="short-url"
          ref={resultRef}
          className="input result"
          type="text"
          readOnly
          value={shortUrl}
          placeholder="Your short URL will show up here"
          onFocus={(event) => event.currentTarget.select()}
        />
        <button
          className="button secondary"
          type="button"
          onClick={handleCopy}
          disabled={!shortUrl}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </section>
  );
}
