'use client';

import SignaturePad from '@/components/signature-pad';

function SignatureDemo() {
  return (
    <div className="w-full h-[100dvh] flex items-center justify-center">
      <div className="w-[300px] aspect-square relative">
        <SignaturePad />
      </div>
    </div>
  );
}

export default SignatureDemo;
