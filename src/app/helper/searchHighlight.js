export default function highlightText(text, highlight) {
  if (!highlight) return text;

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={index} className="text-yellow-400 font-semibold">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
