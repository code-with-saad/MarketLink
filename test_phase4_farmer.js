const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  console.log('\n================ PHASE 4 FARMER MODULE VERIFICATION ================');

  // TEST 1: APPROVED FARMER FLOW
  console.log('\n1. Testing Approved Farmer Flow (farmer.active@marketlink.local)...');
  const page1 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page1.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

  // Login
  await page1.fill('#login-email', 'farmer.active@marketlink.local');
  await page1.fill('#login-password', 'farmerPassword123');
  await page1.click('button[type="submit"]');
  await page1.waitForURL('**/farmer/dashboard');

  console.log(`Approved Farmer logged in -> Current URL: ${page1.url()}`);

  // Click Weekly Stock in sidebar navigation
  await page1.click('a[href="/farmer/stock"]');
  await page1.waitForURL('**/farmer/stock');
  await page1.waitForSelector('h1');

  const stockHeading = await page1.locator('h1').first().textContent();
  console.log(`Stock Page Heading: "${stockHeading.trim()}"`);

  const productRowsCount = await page1.locator('tbody tr').count();
  console.log(`Product Rows Found in Stock Table: ${productRowsCount}`);

  // Test Weekly Template Reset with dialog handler
  page1.on('dialog', async (dialog) => {
    console.log(`Dialog prompt: "${dialog.message()}" -> Accepting`);
    await dialog.accept();
  });

  console.log('Testing "Apply Now" weekly template reset...');
  await page1.click('button:has-text("Apply Now")');
  await page1.waitForTimeout(800);
  const feedbackText = await page1.locator('div:has-text("Stock reset to weekly template")').first().textContent();
  console.log(`Template Apply Feedback: "${feedbackText?.trim() || 'Applied'}"`);

  // Visit Stall Profile Management via sidebar link
  await page1.click('a[href="/farmer/profile"]');
  await page1.waitForURL('**/farmer/profile');
  await page1.waitForSelector('#stall_name');

  const profileHeading = await page1.locator('h1').first().textContent();
  console.log(`Profile Page Heading: "${profileHeading.trim()}"`);

  const stallNameVal = await page1.inputValue('#stall_name');
  console.log(`Loaded Stall Name: "${stallNameVal}"`);

  // TEST 2: PENDING FARMER FLOW
  console.log('\n2. Testing Pending Farmer Flow (farmer.pending@marketlink.local)...');
  const page2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page2.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

  await page2.fill('#login-email', 'farmer.pending@marketlink.local');
  await page2.fill('#login-password', 'farmerPassword123');
  await page2.click('button[type="submit"]');
  await page2.waitForURL('**/farmer/dashboard');

  console.log(`Pending Farmer logged in -> Current URL: ${page2.url()}`);

  // Visit Stock page as pending farmer
  await page2.click('a[href="/farmer/stock"]');
  await page2.waitForURL('**/farmer/stock');
  await page2.waitForTimeout(500);

  const bannerText = await page2.locator('h3:has-text("Stall Account Pending Administrative Approval")').textContent();
  console.log(`Pending Banner Visible: ${Boolean(bannerText)} ("${bannerText.trim()}")`);

  const isAddBtnDisabled = await page2.getAttribute('button:has-text("Add New Harvest Product")', 'disabled');
  console.log(`Add Product Button Disabled for Pending Farmer: ${isAddBtnDisabled !== null}`);

  console.log('\n===================================================================\n');
  await browser.close();
})();
