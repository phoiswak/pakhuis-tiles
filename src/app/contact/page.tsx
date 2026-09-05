import { ContactForm } from "@/components/ContactForm";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { SITE, WHATSAPP_TOPICS } from "@/data/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Pakhuis Tiles in Pretoria East for quotations, stock checks and showroom visits.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Get in touch</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Contact Us</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Speak to our sales team about stock, trade pricing or a site quotation.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="border border-stone-line bg-white p-6 md:p-8">
          <ContactForm />
        </div>
        <div className="space-y-6">
          <div className="border border-stone-line bg-ink p-6 text-stone-soft md:p-8">
            <h2 className="font-display text-2xl">Showroom</h2>
            <ul className="mt-4 space-y-3 text-sm text-stone-muted">
              <li>{SITE.address}</li>
              <li>
                <a href={SITE.phoneHref} className="hover:text-stone-soft">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-stone-soft">
                  {SITE.email}
                </a>
              </li>
              <li>{SITE.hours}</li>
            </ul>
            <WhatsAppLink className="btn-primary mt-6 w-full">
              <WhatsAppIcon />
              Chat on WhatsApp
            </WhatsAppLink>
          </div>
          <div className="border border-stone-line bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl text-ink">WhatsApp assistance</h2>
            <p className="mt-3 text-sm text-ink-muted">
              Choose a topic and WhatsApp will open with a pre-filled message. A consultant can
              take it from there.
            </p>
            <ol className="mt-4 space-y-2">
              {WHATSAPP_TOPICS.map((topic) => (
                <li key={topic.id}>
                  <WhatsAppLink
                    message={topic.message}
                    className="flex items-center justify-between gap-3 border border-stone-line px-3 py-2.5 text-sm text-ink transition hover:border-moss hover:bg-stone-soft"
                  >
                    <span>
                      {topic.id}. {topic.label}
                    </span>
                    <WhatsAppIcon className="text-moss" />
                  </WhatsAppLink>
                </li>
              ))}
            </ol>
          </div>
          <div className="border border-stone-line bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl text-ink">Delivery areas</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-ink-muted">
              {SITE.deliveryAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
