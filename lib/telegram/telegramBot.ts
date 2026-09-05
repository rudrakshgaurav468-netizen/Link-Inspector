import axios from 'axios';

export interface TelegramAlertPayload {
  articleTitle: string;
  articleUrl: string;
  linkUrl: string;
  errorType: string;
  httpStatus: number;
  estimatedRevenueLoss: number;
  fixUrl?: string;
}

export function formatTelegramAlert(data: TelegramAlertPayload): string {
  return `🚨 <b>LinkGuard Alert: Broken Affiliate Link Detected</b>

📄 <b>Article:</b> ${data.articleTitle}
🌐 <b>Page:</b> <a href="${data.articleUrl}">${data.articleUrl}</a>
🔗 <b>Affiliate Link:</b> <code>${data.linkUrl}</code>
❌ <b>Issue:</b> ${data.errorType} (HTTP ${data.httpStatus})
💰 <b>Estimated Revenue at Risk:</b> $${data.estimatedRevenueLoss}/month

⚡ <b>Recommended Action:</b>
Open LinkGuard Dashboard to 1-click apply AI Semantic Replacement or Cloudflare 301 Redirect.

👉 <a href="${data.fixUrl || 'http://localhost:5173/'}"><b>Fix Broken Link Now →</b></a>`;
}

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  if (!botToken || !chatId) {
    return { success: false, error: 'Missing TELEGRAM_BOT_TOKEN or chatId' };
  }

  try {
    const res = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    }, { timeout: 8000 });

    return {
      success: true,
      messageId: res.data?.result?.message_id,
    };
  } catch (err: any) {
    console.error('Telegram API error:', err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data?.description || err.message,
    };
  }
}
