import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = (index: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc pl-6 my-3 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        if (inList) {
          flushList(index);
          inList = false;
        }
        return;
      }

      // Heading 2 (##)
      if (trimmedLine.startsWith('## ')) {
        if (inList) {
          flushList(index);
          inList = false;
        }
        const text = trimmedLine.substring(3);
        elements.push(
          <h2 key={index} className="text-xl font-bold mt-4 mb-2">
            {text}
          </h2>
        );
        return;
      }

      // Heading 3 (###)
      if (trimmedLine.startsWith('### ')) {
        if (inList) {
          flushList(index);
          inList = false;
        }
        const text = trimmedLine.substring(4);
        elements.push(
          <h3 key={index} className="text-lg font-semibold mt-3 mb-2">
            {text}
          </h3>
        );
        return;
      }

      // List item (- or *)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        inList = true;
        const text = trimmedLine.substring(2);
        listItems.push(text);
        return;
      }

      // If we were in a list, flush it
      if (inList) {
        flushList(index);
        inList = false;
      }

      // Regular paragraph
      elements.push(
        <p 
          key={index} 
          className="my-2" 
          dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmedLine) }}
        />
      );
    });

    // Flush any remaining list items
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-final`} className="list-disc pl-6 my-3 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
          ))}
        </ul>
      );
    }

    return elements;
  };

  const parseInlineMarkdown = (text: string): string => {
    // Bold (**text** or __text__)
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong class="font-semibold">$1</strong>');
    
    // Italic (*text* or _text_)
    text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    text = text.replace(/_(.+?)_/g, '<em class="italic">$1</em>');
    
    // Code (`code`)
    text = text.replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>');
    
    return text;
  };

  return <div className="markdown-content">{renderContent(content)}</div>;
};

