import { QUOTE } from "@/content/site";
import Reveal from "./Reveal";

export default function Quote() {
  return (
    <section className="section quote">
      <div className="wrap">
        <Reveal>
          <figure>
            <div className="quote-mark" aria-hidden="true">&ldquo;</div>
            <blockquote>{QUOTE.text}</blockquote>
            <figcaption className="quote-by">
              <b>{QUOTE.attribution}</b>{QUOTE.role}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
