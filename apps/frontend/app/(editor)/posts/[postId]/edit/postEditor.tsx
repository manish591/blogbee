export function PostEditor() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <textarea
        placeholder="Article Title..."
        rows={1}
        maxLength={150}
        className="resize-none font-semibold text-4xl w-full overflow-hidden mb-8 outline-none border-none focus:outline-none"
      ></textarea>
      <div
        className="text-gray-400 text-lg outline-none border-none focus:outline-none"
        contentEditable
        suppressContentEditableWarning={true}
      >
        {'Type "/" for commands...'}
      </div>
    </div>
  );
}
