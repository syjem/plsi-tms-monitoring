# TODO

## 1. Email Authentication — Passwordless Sign-In & Sign-Up Flow (Intended for Yahoo users)

### Proposed Flow (subject for change)

### A. User Enters Email

1. Check if the email exists in the Supabase `users` table.

   - **If YES (existing user):**

     - Send a **Supabase Magic Link** to the email.
     - Magic link should include an **auth redirect URL** back to the authenticated page.

   - **If NO (new user):**
     - Send a **verification code (OTP)** to the email.
     - Display an **Onboarding Form** with the following fields:
       - Verification Code
       - First Name
       - Last Name
       - Avatar Upload (optional)
     - After successful verification and form submission:
       - Create a new user record in the database.
       - Redirect user to the authenticated page.

## 2. Dark Mode Toggle — **✔ Completed**

A simple theme switcher

---

## 3. Custom Error Pages

Create branded / themed pages for:

- 404 (Not Found)
- 500 (Server Error)

---

## 4. Extracting Animation by Stages

Implement a step-based progress animation for:

- Uploading
- Extracting
- Saving

Status: **✔ Done (but still open for refinement)**

---

## 5. Next.js Partial Prerendering (PPR) / Data Streaming

Goal: Render static UI instantly and stream dynamic data afterward—whatever black magic Next.js is using these days 😆

**Current Issues:**

- Entire page waits for server data before rendering.
- No Suspense boundaries around dynamic content.

**Action Items:**

- Wrap every dynamic data fetch in a `<Suspense>` boundary.
- Provide lightweight fallback UI.

Example:

```jsx
<p className="font-semibold text-base text-gray-700 dark:text-gray-300 mb-6 font-mono">
  Welcome, <span className="text-primary">{name}~</span>
</p>

<Suspense fallback={<FallbackUi />}>
  <span className="text-primary">{name}~</span>
</Suspense>
```

---

## 6. User Signature Capture (Canvas → Supabase)

Prompt user to draw their signature using an HTML Canvas, then store it into a dedicated Supabase table.

**Supabase Table Structure**

- id (uuid, primary key)
- user_id (uuid)
- signature (text or bytea — base64 PNG recommended)
- timestamptz (timestamp with time zone)

**Action Items**

- Create a reusable SignaturePad component.
- Add clear/reset functionality.
- Export canvas content as PNG (base64 string).
- Create a server action to save the signature.
- Store the signature in the Supabase table.
- Implement retrieval + preview for documents/logs.
- Limit to one signature per user.
- Normalize image size before saving.
