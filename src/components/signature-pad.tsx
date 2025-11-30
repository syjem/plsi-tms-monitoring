import { Button } from '@/components/ui/button';
import { Signature, SignatureSettings } from '@/utils/classes/signature';
import { Loader } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

function SignaturePad({
  width = 300,
  height = 300,
  onSaveSignature = () => {},
  ...rest
}: SignatureSettings & {
  onSaveSignature?: (signatureData: string) => unknown | Promise<unknown>;
}) {
  const signatureRef = useRef(new Signature(rest));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const signatureCurrent = signatureRef.current;
    return () => {
      signatureCurrent.removeEventListeners();
    };
  }, [signatureRef]);

  /**
   * Clear the canvas to start new signature
   */
  const onClear = () => {
    signatureRef.current.clearCanvas();
  };

  /**
   * Callback to manage the save functionality e.g. saving to database or reading signature value
   */
  const handleSave = () => {
    const signatureData = signatureRef.current.exportSignature();
    setSaving(true);
    return Promise.resolve(onSaveSignature(signatureData))
      .then(() => {})
      .catch((e) => {
        toast.error(e?.message || 'Saving signature has thrown an error!');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <div className="space-y-2">
      <canvas
        id="signature-canvas"
        className="bg-card border border-border"
        width={width}
        height={height}
      ></canvas>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving && (
            <span className="animate-spin">
              <Loader />
            </span>
          )}
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default SignaturePad;
