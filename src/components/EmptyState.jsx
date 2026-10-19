// "Nothing here yet" message with an optional call-to-action passed as children.
// Use as="h1" when the message is the main content of a whole page.
function EmptyState({ icon = "📭", title, text, as: Heading = "h3", children }) {
  return (
    <div className="empty-state">
      <span aria-hidden="true">{icon}</span>
      <Heading>{title}</Heading>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}

export default EmptyState;
