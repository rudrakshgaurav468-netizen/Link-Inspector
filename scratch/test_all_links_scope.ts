import { extractLinksFromArticle } from '../server/crawler';

async function verifyAllLinksScope() {
  console.log('================================================================');
  console.log('🧪 VERIFYING ALL LINKS VS OUTBOUND EXTRACTION SCOPES');
  console.log('================================================================\n');

  const targetUrl = 'https://amc.drguptamd.in';
  console.log(`Auditing target URL: ${targetUrl} with linkScope = 'all'...`);

  const resAll = await extractLinksFromArticle(targetUrl, 'test_amc', '', undefined, 200, 'all');

  console.log('\n📊 [RESULTS - linkScope: ALL]');
  console.log(`  - Rendered Page Title: "${resAll.title}"`);
  console.log(`  - Total <a> tags in DOM: ${resAll.diagnostics.totalAnchorsInDom}`);
  console.log(`  - Internal Domain Links: ${resAll.diagnostics.internalAnchorsCount}`);
  console.log(`  - Outbound Links: ${resAll.diagnostics.outboundAnchorsCount}`);
  console.log(`  - Special / Anchors: ${resAll.diagnostics.specialAnchorsCount}`);
  console.log(`  - Total Extracted & Monitored Links: ${resAll.links.length}`);

  const internalCount = resAll.links.filter(l => l.linkType === 'Internal Link').length;
  const outboundCount = resAll.links.filter(l => l.linkType === 'Outbound Link').length;
  const anchorCount = resAll.links.filter(l => l.linkType?.includes('Anchor')).length;
  const specialCount = resAll.links.filter(l => l.linkType?.includes('Mailto') || l.linkType?.includes('Tel') || l.linkType?.includes('JavaScript') || l.linkType?.includes('Protocol')).length;

  console.log(`  - Breakdown in Links Inventory:`);
  console.log(`      * Internal Routes: ${internalCount}`);
  console.log(`      * Outbound Partners: ${outboundCount}`);
  console.log(`      * Page Anchors (#): ${anchorCount}`);
  console.log(`      * Special (Mailto/Tel/JS): ${specialCount}`);

  console.log('\nSample extracted links:');
  resAll.links.slice(0, 10).forEach((l, i) => {
    console.log(`  [${i + 1}] [${l.linkType}] ${l.anchorText} ➔ ${l.url} (HTTP ${l.httpStatus})`);
  });

  console.log('\n----------------------------------------------------------------');
  console.log(`Auditing target URL: ${targetUrl} with linkScope = 'outbound'...`);

  const resOutbound = await extractLinksFromArticle(targetUrl, 'test_amc_outbound', '', undefined, 200, 'outbound');

  console.log('\n📊 [RESULTS - linkScope: OUTBOUND ONLY]');
  console.log(`  - Total <a> tags in DOM: ${resOutbound.diagnostics.totalAnchorsInDom}`);
  console.log(`  - Outbound Links Extracted: ${resOutbound.links.length}`);
  resOutbound.links.forEach((l, i) => {
    console.log(`  [${i + 1}] [${l.linkType}] ${l.anchorText} ➔ ${l.url} (HTTP ${l.httpStatus})`);
  });

  console.log('\n================================================================');
  console.log('✅ ALL LINKS VERIFICATION COMPLETE');
  console.log('================================================================');
}

verifyAllLinksScope().catch(console.error);
