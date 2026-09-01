/**
 * Renders a headline with exactly one bolded word. Keeps the markup clean:
 * one text node, one <strong>, one text node. No per-word fragmentation.
 */
export default function Emphasis({ text, word }: { text: string; word?: string }) {
  if (!word) return <>{text}</>;
  const i = text.indexOf(word);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <strong>{word}</strong>
      {text.slice(i + word.length)}
    </>
  );
}
