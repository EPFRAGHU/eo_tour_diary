import React, { useState } from 'react';
import {
  Pin,
  History,
  Trash2,
  Plus,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { RichTextRemarksEditor, RemarkItem, RemarkColorLabel } from './RichTextRemarksEditor';
import { formatDate } from '@/lib/utils';

interface RemarksManagerProps {
  initialRemarks?: RemarkItem[];
}

export const RemarksManager: React.FC<RemarksManagerProps> = ({ initialRemarks }) => {
  const [remarks, setRemarks] = useState<RemarkItem[]>(() => {
    if (initialRemarks && initialRemarks.length > 0) return initialRemarks;
    return [
      {
        id: 'rem-1',
        author: 'Rajesh Sharma',
        authorRole: 'EO/AO',
        content: 'May be allowed to take own car for Special Compliance Drive as per Grade IV travel rules.',
        createdAt: '2026-08-05',
        isPinned: true,
        colorLabel: 'AMBER',
        mentions: ['@APFC (Compliance)'],
        version: 'v1.1',
        history: [
          {
            content: 'May be allowed to take own car.',
            updatedAt: '2026-08-01',
            author: 'Rajesh Sharma',
          },
        ],
      },
      {
        id: 'rem-2',
        author: 'APFC (Compliance)',
        authorRole: 'APFC',
        content: 'Approved travel by own car. Please submit Form 11 inspection note within 48 hours to @RPFC (Regional Office).',
        createdAt: '2026-08-06',
        isPinned: false,
        colorLabel: 'EMERALD',
        mentions: ['@RPFC (Regional Office)'],
        version: 'v1.0',
      },
    ];
  });

  const [showEditor, setShowEditor] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const handleAddRemark = (data: {
    content: string;
    isPinned: boolean;
    colorLabel: RemarkColorLabel;
    mentions: string[];
  }) => {
    const newRemark: RemarkItem = {
      id: `rem-${Date.now()}`,
      author: 'Rajesh Sharma',
      authorRole: 'EO/AO',
      content: data.content,
      createdAt: new Date().toISOString().split('T')[0],
      isPinned: data.isPinned,
      colorLabel: data.colorLabel,
      mentions: data.mentions,
      version: 'v1.0',
    };
    setRemarks([newRemark, ...remarks]);
    setShowEditor(false);
  };

  const handleTogglePin = (id: string) => {
    setRemarks(
      remarks.map((r) => (r.id === id ? { ...r, isPinned: !r.isPinned } : r))
    );
  };

  const handleDeleteRemark = (id: string) => {
    if (confirm('Delete this official remark?')) {
      setRemarks(remarks.filter((r) => r.id !== id));
    }
  };

  const getColorLabelBadge = (label: RemarkColorLabel) => {
    switch (label) {
      case 'RED':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">URGENT ACTION</span>;
      case 'AMBER':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">PENDING APFC</span>;
      case 'EMERALD':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">APPROVED / COMPLIANT</span>;
      case 'PURPLE':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">7A / 14B DUES</span>;
      case 'BLUE':
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">OFFICIAL NOTE</span>;
    }
  };

  const pinnedList = remarks.filter((r) => r.isPinned);
  const unpinnedList = remarks.filter((r) => !r.isPinned);

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-epfo-accent" />
          <h3 className="text-sm font-bold text-foreground">Official Remarks & Collaboration System</h3>
        </div>

        <button
          onClick={() => setShowEditor(!showEditor)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white text-xs font-bold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-epfo-accent" />
          <span>+ Add Remark</span>
        </button>
      </div>

      {/* Editor Collapse */}
      {showEditor && (
        <RichTextRemarksEditor
          onSubmitRemark={handleAddRemark}
          onCancel={() => setShowEditor(false)}
        />
      )}

      {/* Section 1: Pinned Remarks (Top Priority) */}
      {pinnedList.length > 0 && (
        <div className="space-y-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-600 dark:text-amber-400">
            <Pin className="w-4 h-4" />
            <span>Pinned Remarks (High Priority)</span>
          </div>

          <div className="space-y-2.5">
            {pinnedList.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground flex items-center gap-1">
                      {item.author}
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground font-bold">({item.authorRole})</span>
                    {getColorLabelBadge(item.colorLabel)}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(item.id)}
                      className="p-1 rounded-lg text-amber-500 hover:bg-muted"
                      title="Unpin Remark"
                    >
                      <Pin className="w-3.5 h-3.5 fill-amber-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteRemark(item.id)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-foreground leading-relaxed font-sans">{item.content}</p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40">
                  <span>{formatDate(item.createdAt)}</span>
                  <span className="font-bold text-epfo-accent">{item.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: General Remarks History Stream */}
      <div className="space-y-3">
        {unpinnedList.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground flex items-center gap-1">
                  {item.author}
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                </span>
                <span className="text-[10px] font-mono text-muted-foreground font-bold">({item.authorRole})</span>
                {getColorLabelBadge(item.colorLabel)}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTogglePin(item.id)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-muted"
                  title="Pin Remark"
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                {item.history && (
                  <button
                    onClick={() => setActiveHistoryId(activeHistoryId === item.id ? null : item.id)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-epfo-accent hover:bg-muted"
                    title="View Edit History"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteRemark(item.id)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-foreground leading-relaxed font-sans">{item.content}</p>

            {/* Edit History Tree Collapse */}
            {activeHistoryId === item.id && item.history && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1 text-[11px] font-mono animate-in fade-in duration-150">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <History className="w-3 h-3 text-epfo-accent" />
                  <span>Previous Revision History:</span>
                </div>
                {item.history.map((h, i) => (
                  <div key={i} className="text-muted-foreground">
                    • "{h.content}" - {h.author} ({formatDate(h.updatedAt)})
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40">
              <span>{formatDate(item.createdAt)}</span>
              <span className="font-bold text-epfo-accent">{item.version}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
