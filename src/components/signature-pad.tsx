import { Button } from '@/components/ui/button';
import { Signature, SignatureSettings } from '@/utils/classes/signature';
import { Loader } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

/**
 * SignaturePad Component
 *
 * A complete React component for capturing and managing digital signatures.
 * Provides a canvas for drawing signatures with save, clear, and export functionality.
 * Includes error handling, loading states, and toast notifications.
 *
 * @component
 * @description
 * - Manages signature capture with customizable styling
 * - Handles async save operations with loading state
 * - Provides user feedback via toast notifications
 * - Automatically initializes and cleans up the Signature class instance
 * - Validates signature data before saving
 *
 * @example
 * // Basic usage with default settings
 * <SignaturePad
 *   onSaveSignature={async (dataUrl) => {
 *     await fetch('/api/save-signature', {
 *       method: 'POST',
 *       body: JSON.stringify({ signature: dataUrl })
 *     });
 *   }}
 * />
 *
 * @example
 * // Custom styling with dark theme
 * <SignaturePad
 *   width={500}
 *   height={300}
 *   strokeColor="#ffffff"
 *   fillColor="#1a1a1a"
 *   strokeWidth={2}
 *   onSaveSignature={handleSaveSignature}
 * />
 *
 * @example
 * // With error handling in parent component
 * const handleSaveSignature = async (dataUrl: string) => {
 *   try {
 *     const response = await api.saveSignature(dataUrl);
 *     if (!response.ok) throw new Error('Save failed');
 *   } catch (error) {
 *     throw new Error('Failed to save signature to server');
 *   }
 * };
 *
 * @param {SignaturePadProps} props - Component props
 * @param {number} [props.width=300] - Canvas width in pixels. Must be positive integer.
 * @param {number} [props.height=300] - Canvas height in pixels. Must be positive integer.
 * @param {number} [props.strokeWidth=0.5] - Thickness of signature stroke in pixels. Supports decimal values.
 * @param {string} [props.strokeColor='#fff'] - Hex color code for the signature stroke
 * @param {string} [props.fillColor='#000'] - Hex color code for the canvas background
 * @param {Function} [props.onSaveSignature=() => {}] - Async callback executed on save. Receives PNG data URL. Should throw Error on failure.
 *
 * @returns {JSX.Element} React component rendering canvas and control buttons
 *
 * @throws {Error} Toast notification displayed if:
 *   - Signature pad fails to initialize
 *   - Signature export fails
 *   - Save callback throws an error
 *
 * @example
 * // Full form integration
 * function SignatureForm() {
 *   const [submitted, setSubmitted] = useState(false);
 *
 *   const handleSubmit = async (dataUrl: string) => {
 *     // Validate, upload, etc.
 *     setSubmitted(true);
 *   };
 *
 *   return (
 *     <form>
 *       {!submitted && (
 *         <SignaturePad onSaveSignature={handleSubmit} />
 *       )}
 *       {submitted && <p>✓ Signature saved successfully</p>}
 *     </form>
 *   );
 * }
 */
function SignaturePad({
  width = 300,
  height = 300,
  onSaveSignature = () => {},
  ...rest
}: SignatureSettings & {
  onSaveSignature?: (signatureData: string) => unknown | Promise<unknown>;
}) {
  const signatureRef = useRef<Signature | null>(null);
  const [color, setColor] = useState({
    background: '',
    foreground: '',
  });

  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Get the value of a CSS variable
    const background = getComputedStyle(
      document.documentElement,
    ).getPropertyValue('--muted');
    const foreground = getComputedStyle(
      document.documentElement,
    ).getPropertyValue('--foreground');

    setColor({
      background,
      foreground,
    });
  }, [theme]);

  useEffect(() => {
    // Create the Signature instance AFTER the canvas is mounted
    signatureRef.current = new Signature({
      ...rest,
      fillColor: color.background,
      strokeColor: color.foreground,
    });

    return () => {
      // Cleanup when component unmounts
      signatureRef.current?.removeEventListeners();
      signatureRef.current = null;
    };
  }, [theme, color.background, color.foreground]);

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
