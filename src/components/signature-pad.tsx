interface SignatureSettings {
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
}

class Signature {
  private canvasRef = '#signature-canvas';
  context!: CanvasRenderingContext2D;
  settings: SignatureSettings = {
    strokeWidth: 1.2,
    strokeColor: '#fff',
    fillColor: '#000',
  };
  constructor(settings: SignatureSettings) {
    // apply settings update
    Object.entries(settings).forEach(([key, value]) => {
      this.settings[key as keyof SignatureSettings] = value;
    });

    // initialize context and  canvas settings
    this.init();
  }

  private init() {
    if (typeof document === 'undefined') return;

    const canvas: HTMLCanvasElement | null = document.querySelector(
      this.canvasRef,
    );

    if (!canvas)
      throw new Error(
        `Canvas reference not found, are you sure you added ${this.canvasRef} id to the canvas element?`,
      );
    // initialize context
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    // apply line width settings
    this.context.lineWidth = this.settings.strokeWidth!;

    // apply stroke color style
    this.context.strokeStyle = this.settings.strokeColor!;

    // set canvas color style
    this.context.fillStyle = this.settings.fillColor!;

    // draw canvas
    this.context.fillRect(0, 0, canvas.width, canvas.width);

    // attach listeners
    this.attachEventListeners();
  }

  attachEventListeners() {}

  removeEventListeners() {}

  mouseUp() {}

  mouseDown() {}

  pointerMove() {}
}

function SignaturePad(props: SignatureSettings) {
  const signature = new Signature({ ...props });
  return (
    <canvas
      id="signature-canvas"
      className="w-full h-full bg-card border border-border"
    ></canvas>
  );
}

export default SignaturePad;
