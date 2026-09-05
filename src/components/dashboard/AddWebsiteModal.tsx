import React, { useState } from 'react';
import { Globe, Clock, Send, Mail, Plus, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const AddWebsiteModal: React.FC = () => {
  const { isAddWebsiteModalOpen, setIsAddWebsiteModalOpen, addWebsite, telegram } = useApp();

  const [url, setUrl] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'twice_daily' | 'weekly'>('daily');
  const [telegramAlerts, setTelegramAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsSubmitting(true);
    await addWebsite(url, frequency, telegramAlerts, emailAlerts);
    setIsSubmitting(false);
    setUrl('');
  };

  return (
    <Modal
      isOpen={isAddWebsiteModalOpen}
      onClose={() => setIsAddWebsiteModalOpen(false)}
      title="Add Monitored Website"
      description="Connect a new domain to discover articles and monitor affiliate links."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://mytechsite.com"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            LinkGuard will automatically locate your /sitemap.xml or /sitemap_index.xml.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Monitoring Frequency</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFrequency('daily')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                frequency === 'daily' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Daily (2 AM)
            </button>
            <button
              type="button"
              onClick={() => setFrequency('twice_daily')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                frequency === 'twice_daily' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Twice Daily
            </button>
            <button
              type="button"
              onClick={() => setFrequency('weekly')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                frequency === 'weekly' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Notifications Checkboxes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={telegramAlerts}
              onChange={(e) => setTelegramAlerts(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-500" />
              Send Telegram alerts when links break
            </span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Send email alerts for critical issues
            </span>
          </label>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => setIsAddWebsiteModalOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="emerald"
            size="md"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Monitoring
          </Button>
        </div>
      </form>
    </Modal>
  );
};
