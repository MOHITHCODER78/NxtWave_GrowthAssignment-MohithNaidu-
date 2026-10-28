import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const results = [];

  const check = (name, ok, detail = '') => {
    results.push({ name, ok, detail });
    console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
  };

  // Fresh profile: no localStorage
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // Navigate to Dashboard via nav
  await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click();
  await page.waitForTimeout(400);

  const welcome = await page.getByRole('heading', { name: /Welcome back/i }).isVisible();
  check('Dashboard loads with welcome heading', welcome);

  const emptyActivity = await page.getByText('No activity yet').isVisible().catch(() => false);
  const savedZero = await page.getByText('None yet').first().isVisible().catch(() => false);
  check('Empty states for new user (no fabricated stats)', emptyActivity || savedZero);

  // Metrics should show 0 not fake numbers
  const metricValues = await page.locator('button .text-2xl').allTextContents();
  const numeric = metricValues.map((v) => v.trim()).filter((v) => /^\d+$/.test(v));
  check(
    'Overview metrics are zero/empty for fresh storage',
    numeric.every((n) => n === '0') && numeric.length >= 2,
    `values=${metricValues.join(',')}`
  );

  // Evolution Engine → generate → save
  await page.getByRole('button', { name: 'Evolution Engine' }).first().click();
  await page.waitForTimeout(300);
  await page.locator('input').first().fill('Campus Attendance Tracker');
  await page.getByRole('button', { name: /Generate Project Evolution Paths/i }).click();
  await page.waitForSelector('text=Save to Dashboard', { timeout: 8000 });

  const saveBtn = page.getByRole('button', { name: /Save to Dashboard/i });
  check('Save to Dashboard button appears after generate', await saveBtn.isVisible());
  await saveBtn.click();
  await page.waitForTimeout(300);
  const saveOk = await page.getByText(/Saved to Student Dashboard/i).isVisible();
  check('Save feedback confirms persistence', saveOk);

  // Dashboard shows project
  await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'My Projects' }).click();
  await page.waitForTimeout(200);
  const projectVisible = await page.getByText(/Campus Attendance|UPGRADE|TRANSFORM|DIFFERENTIATE/i).first().isVisible();
  check('Saved project appears in My Projects', projectVisible);

  // Survive refresh
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'My Projects' }).click();
  await page.waitForTimeout(200);
  const afterRefresh = await page.getByRole('button', { name: /Commit Card/i }).first().isVisible();
  check('Saved project survives refresh', afterRefresh);

  // Commit card from dashboard
  await page.getByRole('button', { name: /Commit Card/i }).first().click();
  await page.waitForTimeout(800);
  const commitVisible = await page.getByText(/Commit|Pledge|Download/i).first().isVisible();
  check('Commit Card opens with project data', commitVisible);

  // Return to dashboard rewards section
  await page.getByRole('button', { name: /Back/i }).first().click().catch(() => {});
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('navigation', { name: 'Dashboard sections' }).getByRole('button', { name: 'Rewards', exact: true }).click();
  await page.waitForTimeout(200);
  const referralCode = await page.getByText(/PULSE-/i).first().isVisible();
  check('Referral section shows real code from Phase 6', referralCode);

  // Mobile viewport no horizontal overflow
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: /Toggle navigation/i }).click().catch(() => {});
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
  });
  check('Mobile layout has no horizontal overflow', !overflow);

  // Malformed localStorage does not crash
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.evaluate(() => {
    localStorage.setItem('projectpulse_saved_projects', '{not-json');
    localStorage.setItem('projectpulse_forks', '[{"id":1}]');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click();
  await page.waitForTimeout(500);
  const stillUp = await page.getByRole('heading', { name: /Welcome back/i }).isVisible();
  check('Malformed localStorage does not crash dashboard', stillUp);

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log('\n--- Summary ---');
  console.log(`${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
