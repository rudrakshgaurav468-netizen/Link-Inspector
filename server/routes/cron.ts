import { Request, Response } from 'express';
import { loadDb, saveDb } from '../db';
import { checkLinkHealth } from '../../lib/checker/checkLink';
import { sendTelegramMessage, formatTelegramAlert } from '../../lib/telegram/telegramBot';
import { sendEmailAlert } from '../../lib/email/sendEmail';

export async function handleDailyCronCheck(req: Request, res: Response) {
  const cronSecret = process.env.CRON_SECRET || 'linkguard_cron_secret_auth_token_2026';
  const authHeader = req.headers.authorization;

  // Protect route
  if (authHeader !== `Bearer ${cronSecret}` && req.query.secret !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET' });
  }

  const db = loadDb();
  const startTime = Date.now();

  let checkedCount = 0;
  let brokenDetected = 0;
  let recoveredCount = 0;
  let alertsDispatched = 0;

  const BATCH_SIZE = 8;
  const linksToCheck = db.links.slice(0, 100);

  for (let i = 0; i < linksToCheck.length; i += BATCH_SIZE) {
    const batch = linksToCheck.slice(i, i + BATCH_SIZE);
    
    await Promise.allSettled(
      batch.map(async (link) => {
        const checkResult = await checkLinkHealth(link.url, link.status);
        checkedCount++;

        const nowStr = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // State Transition: HEALTHY -> BROKEN / WARNING
        if (checkResult.hasStateChanged && (checkResult.status === 'broken' || checkResult.status === 'warning')) {
          brokenDetected++;

          // Create new Alert
          const newAlert = {
            id: 'alt_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
            userId: db.user.id,
            affiliateLinkId: link.id,
            type: checkResult.status,
            message: `${checkResult.errorType || 'HTTP Issue'}: ${link.url}`,
            linkUrl: link.url,
            articleTitle: link.articleTitle,
            estimatedRevenueLoss: link.revenueImpact?.estimatedMonthlyLoss || 150,
            sentToTelegram: db.telegram.isConnected && db.telegram.notificationEnabled,
            sentToEmail: true,
            sentToSlack: db.webhooks.slackEnabled,
            sentToDiscord: db.webhooks.discordEnabled,
            isRead: false,
            isDismissed: false,
            createdAt: new Date().toISOString(),
          };

          db.alerts.unshift(newAlert);
          alertsDispatched++;

          // Dispatch Telegram Alert
          if (db.telegram.isConnected && db.telegram.chatId && process.env.TELEGRAM_BOT_TOKEN) {
            const formatted = formatTelegramAlert({
              articleTitle: link.articleTitle,
              articleUrl: link.articleUrl,
              linkUrl: link.url,
              errorType: checkResult.errorType || 'HTTP Error',
              httpStatus: checkResult.httpStatus,
              estimatedRevenueLoss: link.revenueImpact?.estimatedMonthlyLoss || 150,
            });
            await sendTelegramMessage(process.env.TELEGRAM_BOT_TOKEN, db.telegram.chatId, formatted);
          }

          // Dispatch Email Alert
          if (db.user.email) {
            await sendEmailAlert({
              to: db.user.email,
              articleTitle: link.articleTitle,
              articleUrl: link.articleUrl,
              linkUrl: link.url,
              errorType: checkResult.errorType || 'HTTP Error',
              httpStatus: checkResult.httpStatus,
              estimatedRevenueLoss: link.revenueImpact?.estimatedMonthlyLoss || 150,
            });
          }
        } else if (checkResult.hasStateChanged && checkResult.status === 'healthy') {
          recoveredCount++;
          // Resolve previous alerts
          db.alerts = db.alerts.map(a => a.affiliateLinkId === link.id ? { ...a, isRead: true, isDismissed: true, type: 'resolved' } : a);
        }

        // Update Link in DB
        link.status = checkResult.status;
        link.httpStatus = checkResult.httpStatus;
        link.lastCheckedAt = nowStr;
        if (checkResult.hasStateChanged) {
          link.lastStatusChangeAt = nowStr;
        }

        // Add history entry
        link.checkHistory.unshift({
          date: nowStr,
          status: checkResult.status,
          httpStatus: checkResult.httpStatus,
          responseTimeMs: checkResult.responseTimeMs,
          message: checkResult.message,
        });
        link.checkHistory = link.checkHistory.slice(0, 10);
      })
    );
  }

  saveDb(db);

  const durationMs = Date.now() - startTime;
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    duration: `${(durationMs / 1000).toFixed(2)}s`,
    checkedCount,
    brokenDetected,
    recoveredCount,
    alertsDispatched,
  });
}
