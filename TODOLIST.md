# TODO

## 1. User Signature Capture (Canvas → Supabase)

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
