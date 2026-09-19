import React, { useState } from 'react';
import {
  Bell,
  Send,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Save,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const WebhookIntegrationsModal: React.FC = () => {
  const {
    isWebhooksModalOpen,
    setIsWebhooksModalOpen,
    webhooks,
    saveWebhookSettings,
    sendSlackTestAlert,
    sendDiscordTestAlert
  } = useApp();

  const [slackWebhook, setSlackWebhook] = useState(webhooks.slackWebhookUrl || '');
  const [slackEnabled, setSlackEnabled] = useState(webhooks.slackEnabled);
  const [discordWebhook, setDiscordWebhook] = useState(webhooks.discordWebhookUrl || '');
  const [discordEnabled, setDiscordEnabled] = useState(webhooks.discordEnabled);
  const [notifyOnCriticalOnly, setNotifyOnCriticalOnly] = useState(webhooks.notifyOnCriticalOnly);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebhookSettings({
      slackWebhookUrl: slackWebhook,
      slackEnabled,
      discordWebhookUrl: discordWebhook,
      discordEnabled,
      notifyOnCriticalOnly,
    });
    setIsWebhooksModalOpen(false);
  };

  return (
    <Modal
      isOpen={isWebhooksModalOpen}
      onClose={() => setIsWebhooksModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900">Multi-Channel Webhook Alerts</span>
        </div>
      }
      description="Connect real-time alerts to Slack, Discord, Microsoft Teams, or custom HTTP webhooks."
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Slack Channel */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <div>
                <h4 className="font-bold text-slate-900">Slack Incoming Webhook</h4>
                <p className="text-[11px] text-slate-500">Post rich interactive alert cards to #revenue-alerts</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={slackEnabled}
              onChange={(e) => setSlackEnabled(e.target.checked)}
              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
          </div>

          <div className="space-y-2">
            <input
              type="url"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <button
              type="button"
              onClick={sendSlackTestAlert}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Send Test Alert to Slack
            </button>
          </div>
        </div>

        {/* Discord Channel */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎮</span>
              <div>
                <h4 className="font-bold text-slate-900">Discord Channel Webhook</h4>
                <p className="text-[11px] text-slate-500">Post high-priority embed notifications into your community/team server</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={discordEnabled}
              onChange={(e) => setDiscordEnabled(e.target.checked)}
              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
          </div>

          <div className="space-y-2">
            <input
              type="url"
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <button
              type="button"
              onClick={sendDiscordTestAlert}
              className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Send Test Alert to Discord
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyOnCriticalOnly}
              onChange={(e) => setNotifyOnCriticalOnly(e.target.checked)}
              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <span className="text-slate-700 font-medium">
              Only dispatch webhooks for <strong>Critical Revenue-Loss ($200+/mo)</strong> links
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => setIsWebhooksModalOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="rose"
            size="md"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Webhooks
          </Button>
        </div>
      </form>
    </Modal>
  );
};
