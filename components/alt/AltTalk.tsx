const BOOKING_URL = "https://cal.com/tony-goff-yu-an7khw/intro";

// Closing statement for the alternative site: large, static, and a link to
// book a call.
export default function AltTalk() {
  return (
    <footer className="alt-talk gd-container">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="alt-talk-link"
      >
        <span className="sr-only">
          Let’s talk: book a call (opens in new tab)
        </span>
        <span aria-hidden="true">
          Let’s <span className="alt-talk-u">talk</span>
        </span>
      </a>
    </footer>
  );
}
