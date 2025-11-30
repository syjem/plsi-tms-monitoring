'use client';

import SignaturePad from '@/components/signature-pad';

function SignatureDemo() {
  const readSignatureData = (data: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 10000);
    });
  };
  return (
    <div className="w-full h-[100dvh] flex items-center justify-center">
      <div className="relative">
        <SignaturePad onSaveSignature={readSignatureData} />
      </div>
    </div>
  );
}

export default SignatureDemo;
