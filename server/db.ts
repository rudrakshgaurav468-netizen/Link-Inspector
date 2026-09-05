import fs from 'fs';
import path from 'path';
import { 
  Website, 
  AffiliateLink, 
  Alert, 
  ScanJob, 
  TelegramConnection, 
  User, 
  CompetitorOpportunity, 
  WhiteLabelConfig, 
  WebhookConfig 
} from '../src/types';
import { 
  INITIAL_USER, 
  INITIAL_TELEGRAM, 
  INITIAL_WEBSITES, 
  INITIAL_AFFILIATE_LINKS, 
  INITIAL_ALERTS, 
  INITIAL_SCAN_JOBS,
  INITIAL_COMPETITOR_OPPORTUNITIES,
  INITIAL_WHITE_LABEL,
  INITIAL_WEBHOOKS
} from '../src/data/mockData';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

export interface DatabaseSchema {
  user: User;
  telegram: TelegramConnection;
  websites: Website[];
  links: AffiliateLink[];
  alerts: Alert[];
  scanJobs: ScanJob[];
  competitors: CompetitorOpportunity[];
  whiteLabel: WhiteLabelConfig;
  webhooks: WebhookConfig;
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function loadDb(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      user: INITIAL_USER,
      telegram: INITIAL_TELEGRAM,
      websites: INITIAL_WEBSITES,
      links: INITIAL_AFFILIATE_LINKS,
      alerts: INITIAL_ALERTS,
      scanJobs: INITIAL_SCAN_JOBS,
      competitors: INITIAL_COMPETITOR_OPPORTUNITIES,
      whiteLabel: INITIAL_WHITE_LABEL,
      webhooks: INITIAL_WEBHOOKS,
    };
    saveDb(initialDb);
    return initialDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {
      user: INITIAL_USER,
      telegram: INITIAL_TELEGRAM,
      websites: INITIAL_WEBSITES,
      links: INITIAL_AFFILIATE_LINKS,
      alerts: INITIAL_ALERTS,
      scanJobs: INITIAL_SCAN_JOBS,
      competitors: INITIAL_COMPETITOR_OPPORTUNITIES,
      whiteLabel: INITIAL_WHITE_LABEL,
      webhooks: INITIAL_WEBHOOKS,
    };
  }
}

export function saveDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}
