const BOOKING_URL = "https://cal.com/tony-goff-yu-an7khw/intro";

// Closing statement: large capitals that mirror GANDA at the top of the home
// page, and a link to book a call. fontClass is the same heavy display font
// as GANDA, passed in from the root layout.
export default function AltTalk({ fontClass }: { fontClass: string }) {
  return (
    <footer className="alt-talk gd-container">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`alt-talk-link ${fontClass}`}
      >
        Let’s <span className="alt-talk-u">talk</span>
        <span className="sr-only">: book a call (opens in new tab)</span>
      </a>
    </footer>
  );
}
