import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Bell,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const TelegramModal: React.FC = () => {
  const {
    isTelegramModalOpen,
    setIsTelegramModalOpen,
    telegram,
    connectTelegram,
    disconnectTelegram,
    sendTelegramTestAlert
  } = useApp();

  const [usernameInput, setUsernameInput] = useState(telegram.username || '@alexvance_tech');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput) {
      connectTelegram(usernameInput);
    }
  };

  return (
    <Modal
      isOpen={isTelegramModalOpen}
      onClose={() => setIsTelegramModalOpen(false)}
      title="Connect Telegram Alerts"
      description="Receive instant push notifications the moment an affiliate link breaks or a product goes out of stock."
      maxWidth="md"
    >
      {telegram.isConnected ? (
        /* Connected State */
        <div className="space-y-5 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">✓ Telegram Connected</h4>
              <p className="text-rose-700 mt-0.5">
                Active handle: <strong>{telegram.username}</strong>
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Bot Channel:</span>
              <span className="font-bold text-slate-800 font-mono">{telegram.botUsername}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Notification Status:</span>
              <span className="font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                Enabled (Real-Time)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Connected Since:</span>
              <span className="text-slate-700">August 15, 2026</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="rose"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={sendTelegramTestAlert}
            >
              Send Test Alert to Telegram
            </Button>

            <button
              onClick={disconnectTelegram}
              className="w-full py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Disconnect Telegram Bot
            </button>
          </div>
        </div>
      ) : (
        /* Not Connected Setup Flow */
        <div className="space-y-5 text-xs">
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2AABEE] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-sky-950">LinkGuard Official Alert Bot</h4>
              <p className="text-sky-800 mt-0.5">3-step 30-second connection.</p>
            </div>
          </div>

          <div className="space-y-3 pl-2">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <p className="text-slate-700 leading-relaxed">
                Open Telegram and start chatting with <strong>@LinkGuardAlertsBot</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <p className="text-slate-700 leading-relaxed">
                Send the <code>/connect</code> command or enter your Telegram username below.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <p className="text-slate-700 leading-relaxed">
                LinkGuard will verify your channel and send a test confirmation alert.
              </p>
            </div>
          </div>

          <form onSubmit={handleConnect} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Telegram Username
              </label>
              <div className="relative">
                <Send className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="@alexvance_tech"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#2AABEE] hover:bg-[#229ED9] border-none text-white shadow-sm mt-2"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Connect Telegram
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
};
