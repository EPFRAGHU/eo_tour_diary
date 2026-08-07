import React, { useState } from 'react';
import {
  XCircle,
  Phone,
  MessageSquare,
  Mail,
  Copy,
  Check,
  Send,
  History,
  Clock
} from 'lucide-react';
import { CallLogItem } from '@/types';
import { formatDate } from '@/lib/utils';

interface EmployerContact {
  id: string;
  establishmentCode: string;
  establishmentName: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
}

interface EmployerCommunicationModalProps {
  isOpen: boolean;
  contact: EmployerContact | null;
  historyLogs: CallLogItem[];
  onClose: () => void;
  onAddCallLog: (log: Omit<CallLogItem, 'id'>) => void;
}

export const EmployerCommunicationModal: React.FC<EmployerCommunicationModalProps> = ({
  isOpen,
  contact,
  historyLogs,
  onClose,
  onAddCallLog,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('ECR_NOTICE');
  const [noteText, setNoteText] = useState('');
  const [callPurpose, setCallPurpose] = useState('ECR Return Filing Notice');

  if (!isOpen || !contact) return null;

  const contactHistory = historyLogs.filter(
    (h) => h.contactName.toLowerCase().includes(contact.contactPerson.toLowerCase()) ||
           h.establishmentName.toLowerCase().includes(contact.establishmentName.toLowerCase())
  );

  // Copy Number Handler
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(contact.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WhatsApp Templates
  const getWhatsAppMessage = () => {
    switch (selectedTemplate) {
      case 'SEC_7A':
        return `Dear ${contact.contactPerson} (${contact.establishmentName} - ${contact.establishmentCode}), Official Notice from EPFO Office regarding pending Section 7A Enquiry proceedings. Please present attendance & salary records.`;
      case 'FORM_11':
        return `Dear ${contact.contactPerson}, Notice regarding Form 11 Non-enrolment verification for contractual employees at ${contact.establishmentName}. Please submit compliance response.`;
      case 'ECR_NOTICE':
      default:
        return `Dear ${contact.contactPerson} (${contact.establishmentName}), Reminder to file ECR monthly return for current contribution period on EPFO Portal without delay.`;
    }
  };

  // WhatsApp Trigger
  const handleOpenWhatsApp = () => {
    const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank');

    onAddCallLog({
      contactName: contact.contactPerson,
      establishmentName: contact.establishmentName,
      designation: contact.designation,
      phoneNumber: contact.phone,
      callDate: new Date().toISOString().split('T')[0],
      purpose: `WhatsApp Message (${selectedTemplate})`,
      notes: getWhatsAppMessage(),
    });
  };

  // SMS Trigger
  const handleOpenSMS = () => {
    const text = encodeURIComponent(getWhatsAppMessage());
    window.open(`sms:${contact.phone}?body=${text}`, '_blank');
  };

  // Save Discussion Note & Log
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText) return;

    onAddCallLog({
      contactName: contact.contactPerson,
      establishmentName: contact.establishmentName,
      designation: contact.designation,
      phoneNumber: contact.phone,
      callDate: new Date().toISOString().split('T')[0],
      purpose: callPurpose,
      notes: noteText,
    });

    setNoteText('');
    alert('Logged discussion note & call record successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-epfo-navy text-white px-2 py-0.5 rounded">
                {contact.establishmentCode}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                {contact.designation}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-foreground">{contact.contactPerson}</h2>
            <p className="text-xs text-muted-foreground">{contact.establishmentName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Communication Action Trigger Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Call Button */}
          <a
            href={`tel:${contact.phone}`}
            onClick={() =>
              onAddCallLog({
                contactName: contact.contactPerson,
                establishmentName: contact.establishmentName,
                designation: contact.designation,
                phoneNumber: contact.phone,
                callDate: new Date().toISOString().split('T')[0],
                purpose: 'Outgoing Phone Call',
                notes: 'Dialed employer contact via phone dialer.',
              })
            }
            className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Call (+91)</span>
          </a>

          {/* Action 2: WhatsApp Button */}
          <button
            onClick={handleOpenWhatsApp}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Chat</span>
          </button>

          {/* Action 3: SMS Button */}
          <button
            onClick={handleOpenSMS}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Mail className="w-4 h-4" />
            <span>Send SMS</span>
          </button>

          {/* Action 4: Copy Number */}
          <button
            onClick={handleCopyNumber}
            className="p-3 rounded-xl bg-card border border-border hover:bg-muted text-foreground font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-epfo-accent" />}
            <span>{copied ? 'Copied!' : 'Copy Number'}</span>
          </button>
        </div>

        {/* WhatsApp Pre-filled Message Templates */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2 text-xs">
          <label className="font-bold text-foreground block">Select WhatsApp / Message Compliance Template:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedTemplate('ECR_NOTICE')}
              className={`p-2 rounded-lg border font-semibold text-left transition-colors ${
                selectedTemplate === 'ECR_NOTICE' ? 'bg-epfo-navy text-white border-epfo-navy' : 'bg-background hover:bg-muted'
              }`}
            >
              ECR Filing Reminder
            </button>
            <button
              type="button"
              onClick={() => setSelectedTemplate('SEC_7A')}
              className={`p-2 rounded-lg border font-semibold text-left transition-colors ${
                selectedTemplate === 'SEC_7A' ? 'bg-epfo-navy text-white border-epfo-navy' : 'bg-background hover:bg-muted'
              }`}
            >
              Section 7A Enquiry Notice
            </button>
            <button
              type="button"
              onClick={() => setSelectedTemplate('FORM_11')}
              className={`p-2 rounded-lg border font-semibold text-left transition-colors ${
                selectedTemplate === 'FORM_11' ? 'bg-epfo-navy text-white border-epfo-navy' : 'bg-background hover:bg-muted'
              }`}
            >
              Form 11 Inspection Notice
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground bg-background p-2 rounded-lg border border-border/50 italic">
            "{getWhatsAppMessage()}"
          </p>
        </div>

        {/* Discussion Notes Logger Form */}
        <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-bold text-foreground">Log Discussion Remarks / Call Notes</label>
            <input
              type="text"
              placeholder="Call Purpose / Category"
              value={callPurpose}
              onChange={(e) => setCallPurpose(e.target.value)}
              className="px-2 py-1 rounded-lg bg-background border border-border font-bold outline-none"
            />
          </div>
          <textarea
            rows={2}
            required
            placeholder="Record summary of phone discussion, agreed payment dates, or employer commitment..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold shadow-md"
            >
              <Send className="w-3.5 h-3.5 text-epfo-accent" />
              <span>Log Discussion Note</span>
            </button>
          </div>
        </form>

        {/* Call History Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <History className="w-4 h-4 text-epfo-accent" />
              <span>Call & Communication Audit History</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {contactHistory.length} Recorded Log(s)
            </span>
          </div>

          {contactHistory.length === 0 ? (
            <div className="p-6 text-center border border-dashed rounded-xl space-y-1 text-muted-foreground text-xs">
              <Clock className="w-6 h-6 mx-auto stroke-1" />
              <p>No past calls logged for this employer contact yet.</p>
            </div>
          ) : (
            <div className="relative pl-4 space-y-3 border-l border-border/80">
              {contactHistory.map((log) => (
                <div key={log.id} className="relative space-y-1 p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
                  <div className="absolute -left-[21px] top-3.5 w-2.5 h-2.5 rounded-full bg-epfo-accent"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{log.purpose}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{formatDate(log.callDate)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{log.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
