import { site } from "@/config/site";

const facts = [
  { label: "Founded", value: String(site.founded) },
  { label: "Headquarters", value: site.city },
  { label: "Structure", value: site.structure },
  { label: "Mandate", value: site.mandate },
];

export default function FactsRow() {
  return (
    <dl className="rule-t rule-b grid grid-cols-2 md:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label} className="py-8 pr-6">
          <dt className="t-caption text-slate">{f.label}</dt>
          <dd className="t-h3 mt-2 text-black">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
