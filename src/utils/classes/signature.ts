/**
 * Configuration object for signature canvas settings
 * @typedef {Object} SignatureSettings
 * @property {number} [strokeWidth=0.5] - Width of the stroke in pixels. Supports decimal values
 * @property {string} [strokeColor='#fff'] - Hex color code for the stroke
 * @property {string} [fillColor='#000'] - Hex color code for the canvas background
 * @property {number} [width=300] - Canvas width in pixels
 * @property {number} [height=300] - Canvas height in pixels
 */
export interface SignatureSettings {
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
  width?: number;
  height?: number;
}

/**
 * Signature Canvas Class
 *
 * A utility class for handling canvas-based signature drawing with customizable styling.
 * Manages mouse events, drawing state, and canvas rendering operations.
 *
 * @class Signature
 * @description Provides a complete implementation for drawing signatures on an HTML canvas element.
 * Handles coordinate calculation, path drawing, and event listener management.
 *
 * @example
 * // Basic usage
 * const signature = new Signature({
 *   strokeColor: '#000',
 *   fillColor: '#fff',
 *   strokeWidth: 2,
 *   width: 500,
 *   height: 300
 * });
 *
 * @example
 * // In React component
 * <SignaturePad
 *   width={500}
 *   height={300}
 *   strokeColor="#000"
 *   strokeWidth={1.5}
 *   fillColor="#ffffff"
 * />
 *
 * @throws  Error if canvas element with id '#signature-canvas' not found
 */
export class Signature {
  private canvasRef = '#signature-canvas';
  private context!: CanvasRenderingContext2D;
  private settings: SignatureSettings = {
    strokeWidth: 0.5,
    strokeColor: '#fff',
    fillColor: '#000',
    width: 300,
    height: 300,
  };
  private canvas!: HTMLCanvasElement | null;
  private isDrawing: boolean = false;
  private lastPosition = { x: 0, y: 0 };
  private boundMouseDown: (e: MouseEvent) => void;
  private boundPointerMove: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;

  constructor(settings: SignatureSettings) {
    // apply settings update
    this.updateSettings(settings);

    // initialize context and  canvas settings
    this.init();

    // Bind methods and store them
    this.boundMouseDown = this.mouseDown.bind(this);
    this.boundPointerMove = this.pointerMove.bind(this);
    this.boundMouseUp = this.mouseUp.bind(this);

    this.attachEventListeners();
  }

  /**
   * Initializes the canvas context and applies initial settings
   */
  private init() {
    if (typeof document === 'undefined') return;

    const canvas: HTMLCanvasElement | null = document.querySelector(
      this.canvasRef,
    );

    if (!canvas)
      throw new Error(
        `Canvas reference not found, are you sure you added ${this.canvasRef} id to the canvas element?`,
      );

    this.canvas = canvas;

    // initialize context
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;

    // apply line width settings
    this.context.lineWidth = this.settings.strokeWidth!;

    // apply stroke color style
    this.context.strokeStyle = this.settings.strokeColor!;

    this.context.lineCap = 'round';

    // set canvas color style
    this.context.fillStyle = this.settings.fillColor!;

    // draw canvas
    this.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Updates the signature settings
   */
  private updateSettings(newSettings: SignatureSettings) {
    Object.entries(newSettings).forEach(([key, value]) => {
      this.settings[key as keyof SignatureSettings] = value;
    });
  }

  /**
   * Attaches mouse event listeners to canvas and document
   */
  private attachEventListeners() {
    if (typeof document === 'undefined') return;

    document.addEventListener('mouseup', this.boundMouseUp);
    document.addEventListener('mousemove', this.boundPointerMove);
    this.canvas!.addEventListener('mousedown', this.boundMouseDown);
  }

  /**
   * Removes all attached event listeners
   */
  removeEventListeners() {
    if (typeof document === 'undefined') return;

    this.canvas!.removeEventListener('mousemove', this.boundPointerMove);
    document.removeEventListener('mousedown', this.boundMouseDown);
    document.removeEventListener('mouseup', this.boundMouseUp);
  }

  /**
   * Handles the mouseUp event - ends the drawing path
   */
  private mouseUp(e: MouseEvent) {
    this.setDrawing(false);
    this.context.closePath();
  }

  /**
   * Handles the mouseDown event - begins a new drawing path
   */
  private mouseDown(e: MouseEvent) {
    const { x, y } = this.getXYPosition(e);

    this.setLastPosition({ x, y });
    this.setDrawing(true);

    this.context.beginPath();
    this.context.moveTo(x, y);
  }

  /**
   * Updates the last recorded mouse position
   */
  private setLastPosition({ x, y }: { x: number; y: number }) {
    this.lastPosition = { x, y };
  }

  /**
   * Sets the drawing state
   */
  private setDrawing(drawing: boolean) {
    this.isDrawing = drawing;
  }

  /**
   * Calculates mouse coordinates relative to the canvas element
   */
  private getXYPosition(e: MouseEvent) {
    const rect = this.canvas!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  /**
   * Handles the mousemove event - draws lines on the canvas
   */
  private pointerMove(e: MouseEvent) {
    if (!this.isDrawing) return;
    // get mouse coordinates
    const { x, y } = this.getXYPosition(e);

    this.drawLine({ x, y, type: 'quadratic' });

    this.context.stroke();

    this.setLastPosition({ x, y });
  }

  /**
   * Draw line to the newly set position
   */
  drawLine({
    x,
    y,
    type = 'quadratic',
  }: {
    x: number;
    y: number;
    type: 'line' | 'quadratic';
  }) {
    switch (type) {
      case 'quadratic':
        // Quadratic Bezier smoothing
        const midX = (this.lastPosition.x + x) / 2;
        const midY = (this.lastPosition.y + y) / 2;

        this.context.quadraticCurveTo(
          this.lastPosition.x,
          this.lastPosition.y,
          midX,
          midY,
        );

        break;

      default:
        this.context.lineTo(x, y);
    }
  }

  /**
   * Clears the canvas and resets to the background color
   */
  clearCanvas() {
    if (!this.canvas) return console.warn('Unable to get canvas!');
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Exports the canvas content as a PNG data URL
   *
   * @public
   * @returns {string} Canvas as PNG data URL, or empty string if canvas not available
   */
  exportSignature(): string {
    return this.canvas?.toDataURL('image/png') || '';
  }

  /**
   * Checks if the canvas has any drawn content
   *
   * @public
   * @returns {boolean} True if canvas contains drawn signatures
   */
  isEmpty(): boolean {
    if (!this.canvas) return true;
    const imageData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    return !imageData.data.some((channel, i) => i % 4 === 3 && channel !== 0);
  }
}
