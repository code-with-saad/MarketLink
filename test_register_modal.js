const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('\n--- TESTING REGISTER FORM MODAL RETENTION ---');
  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle' });

  // Fill in fields
  await page.locator('#reg-name').fill('Alice Johnson');
  await page.locator('#reg-email').fill('alice@example.com');
  await page.locator('#reg-password').fill('securePassword123');

  const nameBefore = await page.locator('#reg-name').inputValue();
  const emailBefore = await page.locator('#reg-email').inputValue();
  console.log(`Before modal - Name: "${nameBefore}", Email: "${emailBefore}"`);

  // Open Privacy Policy modal
  console.log('Opening Privacy Policy modal...');
  await page.click('button:has-text("Privacy Policy")');
  await page.waitForTimeout(500);

  // Confirm modal is visible
  const privacyModalVisible = await page.isVisible('text=1. Introduction');
  console.log(`Privacy Policy modal visible: ${privacyModalVisible}`);

  // Close modal via Close button
  console.log('Closing modal...');
  await page.click('button:has-text("Close")');
  await page.waitForTimeout(300);

  // Check form state after modal close
  const nameAfterPrivacy = await page.locator('#reg-name').inputValue();
  const emailAfterPrivacy = await page.locator('#reg-email').inputValue();
  console.log(`After Privacy modal closed - Name: "${nameAfterPrivacy}", Email: "${emailAfterPrivacy}"`);

  // Open Terms of Service modal
  console.log('Opening Terms of Service modal...');
  await page.click('button:has-text("Terms of Service")');
  await page.waitForTimeout(500);

  const termsModalVisible = await page.isVisible('text=1. Acceptance of Terms');
  console.log(`Terms of Service modal visible: ${termsModalVisible}`);

  // Close modal via Escape key
  console.log('Closing Terms modal via Escape key...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  const nameAfterTerms = await page.locator('#reg-name').inputValue();
  const emailAfterTerms = await page.locator('#reg-email').inputValue();
  console.log(`After Terms modal closed - Name: "${nameAfterTerms}", Email: "${emailAfterTerms}"`);

  if (nameBefore === nameAfterTerms && emailBefore === emailAfterTerms && privacyModalVisible && termsModalVisible) {
    console.log('\n>>> SUCCESS: Form data completely retained after opening and closing legal modals! <<<\n');
  } else {
    console.log('\n>>> FAILURE: Form data was lost or modal failed to render! <<<\n');
  }

  await browser.close();
})();
