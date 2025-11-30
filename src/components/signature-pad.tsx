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
  const signatureRef = useRef<Signature | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Create the Signature instance AFTER the canvas is mounted
    signatureRef.current = new Signature({ ...rest });

    return () => {
      // Cleanup when component unmounts
      signatureRef.current?.removeEventListeners();
      signatureRef.current = null;
    };
  }, []);

  /**
   * Clear the canvas to start new signature
   */
  const onClear = () => {
    signatureRef.current?.clearCanvas();
  };

  /**
   * Callback to manage the save functionality e.g. saving to database or reading signature value
   */
  const handleSave = async () => {
    if (!signatureRef.current) {
      toast.error('Signature pad not initialized');
      return;
    }

    const signatureData = signatureRef.current.exportSignature();

    if (!signatureData) {
      toast.error('Failed to export signature');
      return;
    }

    setSaving(true);

    try {
      await onSaveSignature(signatureData);
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : 'Saving signature has thrown an error!',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <canvas
        id="signature-canvas"
        className="bg-card border border-border"
        width={width}
        height={height}
      />
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
