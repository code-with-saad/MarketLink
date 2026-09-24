const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  console.log('\n--- TESTING 401 INTERCEPTOR ROUTE GUARDS ---');

  // Test 1: Clear localStorage, visit "/"
  console.log('\n1. Testing anonymous visit to "/"...');
  const page1 = await browser.newPage();
  await page1.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page1.evaluate(() => localStorage.clear());
  await page1.reload({ waitUntil: 'networkidle' });
  const url1 = page1.url();
  console.log(`Resulting URL for anonymous "/": ${url1}`);

  // Test 2: Put invalid token in localStorage, visit "/"
  console.log('\n2. Testing invalid token visit to "/"...');
  const page2 = await browser.newPage();
  await page2.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page2.evaluate(() => localStorage.setItem('token', 'invalid_expired_token_12345'));
  await page2.reload({ waitUntil: 'networkidle' });
  const url2 = page2.url();
  const tokenAfter2 = await page2.evaluate(() => localStorage.getItem('token'));
  console.log(`Resulting URL for invalid token on "/": ${url2}`);
  console.log(`LocalStorage token after invalid visit: ${tokenAfter2}`);

  // Test 3: Put invalid token in localStorage, visit protected route "/customer/dashboard"
  console.log('\n3. Testing invalid token visit to protected route "/customer/dashboard"...');
  const page3 = await browser.newPage();
  await page3.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page3.evaluate(() => localStorage.setItem('token', 'invalid_expired_token_12345'));
  await page3.goto('http://localhost:5173/customer/dashboard', { waitUntil: 'networkidle' });
  await page3.waitForTimeout(500);
  const url3 = page3.url();
  console.log(`Resulting URL for protected route 401: ${url3}`);

  if (
    url1 === 'http://localhost:5173/' &&
    url2 === 'http://localhost:5173/' &&
    tokenAfter2 === null &&
    url3.includes('/login?reason=expired')
  ) {
    console.log('\n>>> SUCCESS: All 401 interceptor scenarios passed! <<<\n');
  } else {
    console.log('\n>>> FAILURE: Unexpected redirection observed! <<<\n');
  }

  await browser.close();
})();
