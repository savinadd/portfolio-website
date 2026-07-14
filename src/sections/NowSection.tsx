import { nowItems } from "../data/now";

export function NowSection() {
  return (
    <section className="terminal-section">
      <h2>now</h2>
      <ul>
        {nowItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
