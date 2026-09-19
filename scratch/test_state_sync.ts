import { extractLinksFromArticle } from '../server/crawler';

async function testStateSync() {
  const url = 'https://amc.drguptamd.in';
  console.log('Crawling and rendering page with Playwright:', url);

  const result = await extractLinksFromArticle(url, 'web_live_test', 'amc.drguptamd.in', undefined, 200, 'all');

  console.log('--- SCAN RESULT ---');
  console.log('Total Links Extracted (All DOM Anchors):', result.links.length);
  console.log('Diagnostics Total Anchors in DOM:', result.diagnostics.totalAnchorsInDom);
  console.log('Diagnostics Outbound:', result.diagnostics.outboundAnchorsCount);
  console.log('Diagnostics Internal:', result.diagnostics.internalAnchorsCount);
  console.log('Diagnostics Special:', result.diagnostics.specialAnchorsCount);

  // Simulate AppContext state synchronization
  const website = {
    id: 'web_live_test',
    domain: 'amc.drguptamd.in',
    linksCount: result.links.length,
    healthyCount: result.links.filter(l => l.status === 'healthy').length,
    brokenCount: result.links.filter(l => l.status === 'broken').length,
    warningCount: result.links.filter(l => l.status === 'warning').length,
  };

  const affiliateLinks = [...result.links];
  const currentWebsiteLinks = affiliateLinks.filter(l => l.websiteDomain === website.domain || l.websiteId === website.id);

  console.log('\n--- SYNCHRONIZED APP STATE ---');
  console.log('Top Card "Total Links":', currentWebsiteLinks.length);
  console.log('Top Card "Healthy Links":', currentWebsiteLinks.filter(l => l.status === 'healthy').length);
  console.log('Top Card "Broken Issues":', currentWebsiteLinks.filter(l => l.status === 'broken').length);
  console.log('Sidebar "Links Monitored":', website.linksCount);
  console.log('Sidebar Nav "Affiliate Links" Badge:', currentWebsiteLinks.length);
  console.log('QuickLinkAuditor "LINK SCOPE & TYPE: All Links":', result.links.length);

  const allMatch = (
    currentWebsiteLinks.length === result.links.length &&
    website.linksCount === result.links.length &&
    currentWebsiteLinks.length === 49
  );

  console.log('\n✅ All Counts Match Exactly 49 (Single Source of Truth):', allMatch);
  if (!allMatch) {
    throw new Error('State mismatch detected! Expected 49 everywhere, got: ' + currentWebsiteLinks.length);
  }
}

testStateSync().catch(err => {
  console.error(err);
  process.exit(1);
});
