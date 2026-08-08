import React, { useState, useEffect } from 'react';
import { XCircle, Save, Building2 } from 'lucide-react';
import { EstablishmentDTO, CoverageStatus } from '@/types';
import { formatOdishaEstCode } from '@/lib/utils';

interface EstablishmentFormModalProps {
  isOpen: boolean;
  establishment?: EstablishmentDTO | null;
  onClose: () => void;
  onSave: (est: Omit<EstablishmentDTO, 'id'> | EstablishmentDTO) => void;
}

export const EstablishmentFormModal: React.FC<EstablishmentFormModalProps> = ({
  isOpen,
  establishment,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    establishmentCode: '',
    name: '',
    location: '',
    district: 'Cuttack',
    coverageStatus: 'COVERED' as CoverageStatus,
    industryType: 'Manufacturing',
  });

  useEffect(() => {
    if (establishment) {
      setFormData({
        establishmentCode: formatOdishaEstCode(establishment.establishmentCode, establishment.district),
        name: establishment.name,
        location: establishment.location,
        district: establishment.district,
        coverageStatus: establishment.coverageStatus,
        industryType: establishment.industryType || 'Manufacturing',
      });
    } else {
      setFormData({
        establishmentCode: 'OR/BBS/0000000/000',
        name: '',
        location: '',
        district: 'Cuttack',
        coverageStatus: 'COVERED',
        industryType: 'Manufacturing',
      });
    }
  }, [establishment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.establishmentCode || !formData.name) return;

    const formattedCode = formatOdishaEstCode(formData.establishmentCode, formData.district);
    const dataToSave = {
      ...formData,
      establishmentCode: formattedCode,
    };

    if (establishment) {
      onSave({
        ...establishment,
        ...dataToSave,
      });
    } else {
      onSave(dataToSave);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-epfo-accent" />
            <h3 className="text-base font-bold text-foreground">
              {establishment ? 'Edit Establishment Record' : 'Register New Establishment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Establishment Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. OR/6276 or MH/BAN/0012345/000"
                value={formData.establishmentCode}
                onChange={(e) => setFormData({ ...formData, establishmentCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-foreground">Coverage Status *</label>
              <select
                value={formData.coverageStatus}
                onChange={(e) => setFormData({ ...formData, coverageStatus: e.target.value as CoverageStatus })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              >
                <option value="COVERED">Covered Sec 1(3)</option>
                <option value="UNCOVERED">Uncovered / Eligible</option>
                <option value="EXEMPTED">Exempted Estt</option>
                <option value="CLUSTER_HANDLOOM">PMVBRY Cluster / Handloom</option>
                <option value="GOVT_UNDERTAKING">Government Undertaking</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Establishment Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. M/s Jindal Stainless Steel Ltd"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Location / Station *</label>
              <input
                type="text"
                required
                placeholder="e.g. Danagadi, Jajpur"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-foreground">District *</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              >
                <option value="Cuttack">Cuttack</option>
                <option value="Jajpur">Jajpur</option>
                <option value="Angul">Angul</option>
                <option value="Nayagarh">Nayagarh</option>
                <option value="Puri">Puri</option>
                <option value="Khurda">Khurda / BBSR</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Industry / Economic Sector</label>
            <input
              type="text"
              placeholder="e.g. Textiles, Mining, IT Services, Construction"
              value={formData.industryType}
              onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border font-semibold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold shadow-md"
            >
              <Save className="w-3.5 h-3.5 text-epfo-accent" />
              <span>{establishment ? 'Update Establishment' : 'Register Establishment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
