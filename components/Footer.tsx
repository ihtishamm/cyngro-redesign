import { contact, navLinks, services } from "@/lib/data";
import Wordmark from "./Wordmark";
import { LocalTime } from "./ui";

export default function Footer() {
  return (
    <footer className="gutter relative bg-green pb-[var(--gutter)] pt-6 text-ink">
      <div className="grid grid-cols-2 gap-y-8 text-[14px] md:grid-cols-12">
        <a href={`mailto:${contact.email}`} className="it col-span-2 text-[22px] leading-none hover:underline md:col-span-6">
          {contact.email}
        </a>
        <div className="md:col-span-2">
          <LocalTime />
        </div>
        <ul className="md:col-span-2">
          {contact.socials.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer" className="hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="md:col-span-2">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <ul className="mono mt-14 flex flex-wrap gap-x-6 gap-y-1 text-[10px]">
        {services.map((s) => (
          <li key={s.code}>
            {s.title[0]} {s.title[1]}
          </li>
        ))}
      </ul>

      <div className="mt-[10vh]">
        <Wordmark morph />
      </div>

      <div className="mono mt-4 flex flex-wrap justify-between gap-2 text-[10px]">
        <span>© Cyngro. Connect. Automate. Grow Faster.</span>
        <span>Your reliable UK tech partner</span>
      </div>
    </footer>
  );
}
