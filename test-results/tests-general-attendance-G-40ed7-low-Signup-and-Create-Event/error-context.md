# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/general-attendance.spec.js >> General Attendance Flow >> Host Flow: Signup and Create Event
- Location: tests/general-attendance.spec.js:9:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder(/example@email.com/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - img "logo" [ref=e5]
        - heading "Log in to your account" [level=2] [ref=e6]
      - generic [ref=e7]:
        - generic [ref=e8]:
          - generic [ref=e9]:
            - generic [ref=e10]: Matric No.
            - textbox "Matric No." [ref=e12]:
              - /placeholder: ____/______
          - generic [ref=e13]:
            - generic [ref=e14]:
              - generic [ref=e15]: Password
              - link "Forgot password?" [ref=e17] [cursor=pointer]:
                - /url: /forgot-password
            - textbox "Password" [ref=e19]
          - button "Log in" [ref=e20] [cursor=pointer]
        - paragraph [ref=e22]:
          - text: Haven't signed up?
          - link "Sign up" [ref=e23] [cursor=pointer]:
            - /url: /signup
    - generic "PixelBlast interactive background" [ref=e24]
  - alert [ref=e26]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe.serial('General Attendance Flow', () => {
  4   |   let eventUrl = '';
  5   |   // Save the email across steps so we can use it to log in
  6   |   const testEmail = `host_${Date.now()}@example.com`;
  7   |   const testPassword = 'password123';
  8   | 
  9   |   test('Host Flow: Signup and Create Event', async ({ page }) => {
  10  |     // ==========================================
  11  |     // STEP 1: General User Signup
  12  |     // ==========================================
  13  |     await page.goto('http://localhost:3001/signup');
  14  | 
  15  |     // Toggle to General User
  16  |     await page.getByRole('button', { name: /general use/i }).click();
  17  | 
  18  |     // Fill out the signup form
  19  |     await page.getByPlaceholder(/John Doe/i).fill('Event Organizer');
  20  |     await page.getByPlaceholder(/example@email.com/i).fill(testEmail);
  21  |     await page.locator('input[type="password"]').fill(testPassword);
  22  | 
  23  |     // Submit signup
  24  |     await page.getByRole('button', { name: /sign up/i }).click();
  25  | 
  26  |     // Wait for the signup network request to finish and toast to appear
  27  |     await page.waitForTimeout(2000); 
  28  | 
  29  |     // ==========================================
  30  |     // STEP 1.5: Manual Login Flow
  31  |     // ==========================================
  32  |     // Since email confirmation is pending/disabled, navigate to login page
  33  |     await page.goto('http://localhost:3001/login');
  34  | 
  35  |     // Switch to General/Email login mode if your UI requires a tab toggle
  36  |     // await page.getByRole('button', { name: /email/i }).click();
  37  | 
  38  |     // Fill out your login form fields (Update placeholders if your login page uses different text)
> 39  |     await page.getByPlaceholder(/example@email.com/i).fill(testEmail);
      |                                                       ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  40  |     await page.locator('input[type="password"]').fill(testPassword);
  41  |     
  42  |     // Click Log In
  43  |     await page.getByRole('button', { name: /log in/i }).click();
  44  | 
  45  |     // Assert: Now we can safely wait to hit the dashboard!
  46  |     await expect(page).toHaveURL(/.*dashboard/);
  47  | 
  48  | 
  49  |     // ==========================================
  50  |     // STEP 2: Create Event & Generate QR
  51  |     // ==========================================
  52  |     await page.goto('http://localhost:3001/general-events');
  53  | 
  54  |     // Fill in the event name
  55  |     await page.getByPlaceholder(/e.g., Tech Conference 2024/i).fill('Playwright Automated Event');
  56  | 
  57  |     // Click the button to start the session
  58  |     await page.getByRole('button', { name: /Create Event & Get QR/i }).click();
  59  | 
  60  |     // Assert: Wait for the hidden test string containing the deep link URL
  61  |     const urlElement = page.locator('#test-qr-url');
  62  |     await expect(urlElement).toBeVisible({ state: 'attached' });
  63  | 
  64  |     eventUrl = await urlElement.textContent();
  65  |     expect(eventUrl).toContain('http');
  66  |     console.log(`Generated Event URL: ${eventUrl}`);
  67  |   });
  68  | 
  69  | 
  70  |   test('Attendee Flow: Web Fallback (Google Lens Simulation)', async ({ browser }) => {
  71  |     expect(eventUrl).toBeTruthy();
  72  | 
  73  |     // ==========================================
  74  |     // STEP 3: Simulate Google Lens Scan
  75  |     // ==========================================
  76  |     const context = await browser.newContext();
  77  |     const attendeePage = await context.newPage();
  78  | 
  79  |     await attendeePage.goto(eventUrl);
  80  | 
  81  |     // Assert: The single-input name form should render
  82  |     const nameInput = attendeePage.getByPlaceholder(/John Doe/i);
  83  |     await expect(nameInput).toBeVisible();
  84  | 
  85  |     // Fill in the attendee name and submit
  86  |     await nameInput.fill('Playwright Tester');
  87  |     await attendeePage.getByRole('button', { name: /confirm attendance/i }).click();
  88  | 
  89  |     // Assert: Look for the success UI
  90  |     await expect(attendeePage.getByText(/success/i)).toBeVisible();
  91  | 
  92  |     // ==========================================
  93  |     // STEP 4: Test Deduplication (Refresh Page)
  94  |     // ==========================================
  95  |     await attendeePage.reload();
  96  | 
  97  |     // Assert: The form should be hidden, and the success screen should show
  98  |     await expect(nameInput).not.toBeVisible();
  99  |     await expect(attendeePage.getByText(/already checked in/i)).toBeVisible();
  100 | 
  101 |     await context.close();
  102 |   });
  103 | });
```