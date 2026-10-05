import { Shortener } from './shortener';

export default function Home() {
  return (
    <main className="page">
      <header className="header">
        <h1>monkey-short</h1>
        <p className="tagline">Paste a long link, get a short one.</p>
      </header>

      <Shortener />

      <section className="section">
        <h2>How to use</h2>
        <ol className="steps">
          <li>
            Paste the link you want to shorten. It needs to start with{' '}
            <code>http://</code> or <code>https://</code>. If you leave that
            part out, <code>https://</code> is added for you.
          </li>
          <li>
            Press <strong>Shorten</strong> and wait for the short link to show
            up.
          </li>
          <li>
            Copy it and share it. Anyone who opens the short link is sent
            straight to the original page.
          </li>
        </ol>
      </section>

      <section className="notice" aria-labelledby="notice-title">
        <h2 id="notice-title">Why is it slow sometimes?</h2>
        <p>
          The API runs on Render&apos;s free plan, which puts the server to
          sleep after about 15 minutes without traffic. If nobody has used it in
          a while, the first request has to wake it up first, and that can take
          up to a minute. Once it&apos;s awake, everything is quick again.
        </p>
        <p>
          The same goes for opening a short link: the very first visit after a
          quiet period may take a moment before it redirects.
        </p>
      </section>

      <footer className="footer">Built with NestJS, MongoDB and Redis.</footer>
    </main>
  );
}
