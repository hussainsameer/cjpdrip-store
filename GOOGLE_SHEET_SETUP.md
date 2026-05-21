# Google Sheet Membership Capture — Setup (10 min)

This gets every "Join the Party" signup saved into a Google Sheet you own.

## Step 1 — Create the Sheet

1. Go to https://sheets.new (creates a fresh Google Sheet)
2. Name it: **CJP Drip — Members**
3. In Row 1, add headers (one per cell): `Timestamp | Name | Email | City | Reason | Source`

## Step 2 — Open Apps Script

1. In the Sheet, click menu **Extensions → Apps Script**
2. Delete whatever code is in the editor
3. Paste this in:

```js
const SHEET_NAME = 'Sheet1'; // change if your tab is named differently

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.city || '',
      data.reason || '',
      data.source || 'website',
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click the **Save** icon (or Ctrl+S)
5. Name the project: **CJP Members Webhook**

## Step 3 — Deploy as Web App

1. Top right → click **Deploy → New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Fill in:
   - Description: `CJP Members Capture`
   - Execute as: **Me (your-email@gmail.com)**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Google will ask permission → Authorize → grant access
6. Copy the **Web app URL** that appears (looks like `https://script.google.com/macros/s/AKfy.../exec`)

## Step 4 — Tell me the URL

Send me that URL. I'll add it as an env var in Vercel and wire the Join form to push every signup to your Sheet.

That's it. From then on, every Join the Party signup automatically writes a new row in your Sheet.
