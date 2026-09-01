import { CONTACT } from "@/content/site";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <Reveal><p className="label">{CONTACT.label}</p></Reveal>
        <div className="contact-grid">
          <Reveal>
            <div>
              <h2 className="h-sec">{CONTACT.heading}</h2>
              <p className="lede" style={{ marginTop: 20 }}>{CONTACT.standfirst}</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <dl>
              <div className="cx">
                <dt>Investors</dt>
                <dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd>
              </div>
              <div className="cx">
                <dt>Press</dt>
                <dd><a href={`mailto:${CONTACT.press}`}>{CONTACT.press}</a></dd>
              </div>
              <div className="cx">
                <dt>Telephone</dt>
                <dd><a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}>{CONTACT.phone}</a></dd>
              </div>
              <div className="cx">
                <dt>Office</dt>
                <dd><address>{CONTACT.address.map((l) => <span key={l}>{l}<br /></span>)}</address></dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
