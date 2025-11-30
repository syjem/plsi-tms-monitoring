export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Supabase Auth API Reference</h1>
        <p className="mb-8 text-muted-foreground">
          Production-ready code for passwordless authentication with getClaims()
          support
        </p>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-xl font-semibold">Included APIs:</h2>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Check if User Exists (via RPC function)</li>
              <li>Send Magic Link (Existing Users)</li>
              <li>Send OTP (New Users)</li>
              <li>Verify OTP & Create User with Metadata</li>
              <li>Upload Avatar to Storage Bucket</li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-xl font-semibold">
              User Metadata (via getClaims)
            </h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Data stored in{' '}
              <code className="rounded bg-muted px-1.5 py-0.5">
                raw_user_meta_data
              </code>{' '}
              and accessible via{' '}
              <code className="rounded bg-muted px-1.5 py-0.5">
                getClaims()
              </code>
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              {`{
  "user_metadata": {
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "email": "john@yahoo.com",
    "avatar_url": "https://..."
  },
  "email": "john@yahoo.com",
  "email_verified": true  // Set by verifyOtp()
}`}
            </pre>
          </div>

          <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-6">
            <h2 className="mb-2 text-xl font-semibold text-blue-600">
              Avatar Storage Explained
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">
                  Social Auth (Google, GitHub):
                </p>
                <p>
                  Avatar URL provided by OAuth provider. Stored as external URL
                  - no bucket needed.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Custom Upload:</p>
                <p>
                  File uploaded to Supabase Storage bucket. Bucket required
                  because we&apos;re hosting the actual binary file.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-6">
            <h2 className="mb-2 text-xl font-semibold text-green-600">
              Email Verification
            </h2>
            <p className="text-sm text-muted-foreground">
              When{' '}
              <code className="rounded bg-muted px-1.5 py-0.5">
                verifyOtp()
              </code>{' '}
              succeeds, Supabase automatically sets{' '}
              <code className="rounded bg-muted px-1.5 py-0.5">
                email_confirmed_at
              </code>{' '}
              timestamp and{' '}
              <code className="rounded bg-muted px-1.5 py-0.5">
                email_verified: true
              </code>{' '}
              in the user record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
