'use client';

import SignaturePad from '@/components/signature-pad';

function SignatureDemo() {
  return (
    <div className="w-full h-[100dvh] flex items-center justify-center">
      <div className="relative">
        <SignaturePad />
      </div>
    </div>
  );
}

export default SignatureDemo;
