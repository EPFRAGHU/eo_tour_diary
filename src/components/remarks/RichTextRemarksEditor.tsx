import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  AtSign,
  Zap,
  Tag,
  Send,
  Pin
} from 'lucide-react';

export type RemarkColorLabel = 'RED' | 'AMBER' | 'EMERALD' | 'BLUE' | 'PURPLE';

export interface RemarkItem {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
  colorLabel: RemarkColorLabel;
  mentions: string[];
  version: string;
  history?: { content: string; updatedAt: string; author: string }[];
}

interface RichTextRemarksEditorProps {
  onSubmitRemark: (remark: {
    content: string;
    isPinned: boolean;
    colorLabel: RemarkColorLabel;
    mentions: string[];
  }) => void;
  onCancel?: () => void;
}

export const RichTextRemarksEditor: React.FC<RichTextRemarksEditorProps> = ({
  onSubmitRemark,
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [colorLabel, setColorLabel] = useState<RemarkColorLabel>('BLUE');
  const [showMentionMenu, setShowMentionMenu] = useState(false);

  const availableMentions = [
    { id: 'm-1', name: 'APFC (Compliance)', role: 'APFC' },
    { id: 'm-2', name: 'RPFC (Regional Office)', role: 'RPFC' },
    { id: 'm-3', name: 'Shri M.R. Mohapatra (EO)', role: 'EO' },
    { id: 'm-4', name: 'Shri R.N. Moharana (EO)', role: 'EO' },
  ];

  const epfoTemplates = [
    { label: 'Own Car Travel', text: 'May be allowed to take own car as per Grade IV travel rules.' },
    { label: 'Form 11 Notice', text: 'Form 11 Non-enrolment verification notice issued for contract staff.' },
    { label: 'Section 7A Enquiry', text: 'Section 7A dues recovery hearing held; employer requested 7 days extension.' },
    { label: 'PMVBRY Campaign', text: 'Conducted PMVBRY cluster awareness camp for handloom weavers.' },
    { label: '14B Default Damages', text: 'Section 14B damages hearing notice issued for default period May-July.' },
  ];

  // Insert Rich Text Formatting
  const handleFormat = (tag: string) => {
    if (tag === 'bold') setContent((prev) => `${prev} **bold text** `);
    if (tag === 'italic') setContent((prev) => `${prev} *italic text* `);
    if (tag === 'underline') setContent((prev) => `${prev} _underlined text_ `);
    if (tag === 'list') setContent((prev) => `${prev}\n• Item 1\n• Item 2\n`);
  };

  // Insert Mention
  const handleInsertMention = (name: string) => {
    setContent((prev) => `${prev} @${name} `);
    setShowMentionMenu(false);
  };

  // Insert Template
  const handleInsertTemplate = (text: string) => {
    setContent((prev) => `${prev} ${text}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Extract @mentions
    const mentionsFound = (content.match(/@[\w\s()]+/g) || []).map((m) => m.trim());

    onSubmitRemark({
      content,
      isPinned,
      colorLabel,
      mentions: mentionsFound,
    });

    setContent('');
    setIsPinned(false);
    setColorLabel('BLUE');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3 text-xs">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted font-bold"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted italic"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('underline')}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted underline"
            title="Underline (_text_)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('list')}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-border mx-1"></div>

          {/* @Mention Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMentionMenu(!showMentionMenu)}
              className="p-1.5 rounded-lg bg-epfo-accent/10 text-epfo-accent font-bold flex items-center gap-1 hover:bg-epfo-accent/20"
              title="Mention Officer"
            >
              <AtSign className="w-3.5 h-3.5" />
              <span>@Mention</span>
            </button>

            {showMentionMenu && (
              <div className="absolute left-0 top-8 z-30 w-48 bg-card border border-border shadow-xl rounded-xl p-1 space-y-1">
                {availableMentions.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleInsertMention(m.name)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted text-xs font-semibold flex items-center justify-between"
                  >
                    <span>{m.name}</span>
                    <span className="text-[9px] bg-epfo-navy/10 px-1.5 py-0.5 rounded font-mono">{m.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* EPFO Templates Select Dropdown */}
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              if (e.target.value) handleInsertTemplate(e.target.value);
              e.target.value = '';
            }}
            className="px-2.5 py-1 rounded-xl bg-background border border-border text-[11px] font-bold text-foreground outline-none focus:ring-2 focus:ring-epfo-accent"
          >
            <option value="">⚡ Insert EPFO Template...</option>
            {epfoTemplates.map((t, idx) => (
              <option key={idx} value={t.text}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Pin Remark Toggle */}
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
              isPinned ? 'bg-amber-500 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title="Pin Remark to Top"
          >
            <Pin className="w-3.5 h-3.5" />
            <span className="text-[10px]">{isPinned ? 'Pinned' : 'Pin'}</span>
          </button>
        </div>
      </div>

      {/* Color Label Badge Picker */}
      <div className="flex items-center gap-2 text-[11px]">
        <span className="font-bold text-foreground flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-epfo-accent" />
          Color Label:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setColorLabel('RED')}
            className={`w-5 h-5 rounded-full bg-red-500 ring-2 transition-all ${colorLabel === 'RED' ? 'ring-foreground scale-110' : 'ring-transparent'}`}
            title="Urgent Action (Red)"
          />
          <button
            type="button"
            onClick={() => setColorLabel('AMBER')}
            className={`w-5 h-5 rounded-full bg-amber-500 ring-2 transition-all ${colorLabel === 'AMBER' ? 'ring-foreground scale-110' : 'ring-transparent'}`}
            title="Pending APFC Review (Amber)"
          />
          <button
            type="button"
            onClick={() => setColorLabel('EMERALD')}
            className={`w-5 h-5 rounded-full bg-emerald-500 ring-2 transition-all ${colorLabel === 'EMERALD' ? 'ring-foreground scale-110' : 'ring-transparent'}`}
            title="Compliant / Approved (Emerald)"
          />
          <button
            type="button"
            onClick={() => setColorLabel('BLUE')}
            className={`w-5 h-5 rounded-full bg-blue-500 ring-2 transition-all ${colorLabel === 'BLUE' ? 'ring-foreground scale-110' : 'ring-transparent'}`}
            title="Official Note (Blue)"
          />
          <button
            type="button"
            onClick={() => setColorLabel('PURPLE')}
            className={`w-5 h-5 rounded-full bg-purple-500 ring-2 transition-all ${colorLabel === 'PURPLE' ? 'ring-foreground scale-110' : 'ring-transparent'}`}
            title="Section 7A / 14B Dues (Purple)"
          />
        </div>
      </div>

      {/* Textarea Input */}
      <textarea
        rows={3}
        required
        placeholder="Write official remarks, tag officers with @Name, or insert EPFO template..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none text-xs leading-relaxed font-sans"
      />

      {/* Submit Bar */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl border border-border font-semibold hover:bg-muted"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold shadow-md transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5 text-epfo-accent" />
          <span>Post Remark</span>
        </button>
      </div>
    </form>
  );
};
