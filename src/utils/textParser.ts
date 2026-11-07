import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export interface ParsedSegment {
  type: 'html' | 'action_button';
  content: string;
  actionTag?: string;
}

/**
 * Extracts UniGuide action tags in the form [Action Label] and converts standard
 * Markdown into clean HTML while preserving action button triggers.
 */
export function parseUniGuideResponse(rawMarkdown: string): {
  html: string;
  actions: string[];
} {
  const actions: string[] = [];

  // Match [Action Name] patterns where Action Name is like "Go to Course Registration"
  const actionRegex = /\[([A-Za-z0-9\s:–—\$\.,\?]+)\]/g;

  // Find all action tags that match recognized UniGuide triggers
  let match;
  while ((match = actionRegex.exec(rawMarkdown)) !== null) {
    const label = match[1].trim();
    if (
      label.length > 2 &&
      label.length < 40 &&
      !label.toLowerCase().includes('http') &&
      !label.toLowerCase().startsWith('image')
    ) {
      if (!actions.includes(label)) {
        actions.push(label);
      }
    }
  }

  // Convert raw markdown to html
  let html = marked.parse(rawMarkdown) as string;

  // Add Tailwind styling classes to raw tables and callout blocks
  html = html
    .replace(
      /<table>/g,
      '<div class="overflow-x-auto my-3"><table class="w-full text-xs text-left border-collapse border border-slate-700/60 rounded-lg overflow-hidden bg-slate-900/40">'
    )
    .replace(/<\/table>/g, '</table></div>')
    .replace(
      /<thead>/g,
      '<thead class="bg-indigo-950/70 text-indigo-200 uppercase font-semibold text-[11px] tracking-wider border-b border-indigo-800/40">'
    )
    .replace(
      /<th/g,
      '<th class="py-2.5 px-3 border border-slate-700/40 text-left font-medium"'
    )
    .replace(
      /<td/g,
      '<td class="py-2 px-3 border border-slate-800/50 text-slate-300 font-normal"'
    )
    .replace(
      /<blockquote>/g,
      '<blockquote class="my-3 pl-3.5 pr-3 py-2.5 border-l-4 border-amber-500 bg-amber-950/30 text-amber-200 text-xs rounded-r-md">'
    )
    .replace(
      /<ul>/g,
      '<ul class="list-disc list-inside space-y-1 my-2 text-slate-300 text-xs">'
    )
    .replace(
      /<ol>/g,
      '<ol class="list-decimal list-inside space-y-1.5 my-2 text-slate-300 text-xs font-medium">'
    );

  return { html, actions };
}
