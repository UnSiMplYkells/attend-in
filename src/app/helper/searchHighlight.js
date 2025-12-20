export default function highlightText(text, highlight) {
    if (!highlight) return text;

    const regex = new RegExp(`(${highlight})`, "gi"); // match case-insensitive
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-yellow-400 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  }