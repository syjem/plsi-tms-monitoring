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
    strokeColor: '#000',
    fillColor: '#fff',
    width: 300,
    height: 300,
  };
  private canvas!: HTMLCanvasElement | null;
  private isDrawing: boolean = false;
  private lastPosition = { x: 0, y: 0 };
  private boundMouseDown: (e: MouseEvent | TouchEvent) => void;
  private boundPointerMove: (e: MouseEvent | TouchEvent) => void;
  private boundMouseUp: (e: MouseEvent | TouchEvent) => void;

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
    document.addEventListener('mousemove', this.boundPointerMove);
    this.canvas!.addEventListener('mousedown', this.boundMouseDown);
    this.canvas!.addEventListener('mouseup', this.boundMouseUp);

    // Touch events
    this.canvas!.addEventListener('touchstart', this.boundMouseDown, {
      passive: true,
    });
    this.canvas!.addEventListener('touchend', this.boundMouseDown);
    document.addEventListener('touchmove', this.boundPointerMove);
  }

  /**
   * Removes all attached event listeners
   */
  removeEventListeners() {
    if (typeof document === 'undefined') return;

    document.removeEventListener('mousemove', this.boundPointerMove);
    this.canvas!.removeEventListener('mousedown', this.boundMouseDown);
    this.canvas!.removeEventListener('mouseup', this.boundMouseUp);

    // Touch events
    this.canvas!.removeEventListener('touchstart', this.boundMouseUp);
    this.canvas!.removeEventListener('touchend', this.boundMouseDown);
    document.removeEventListener('touchmove', this.boundPointerMove);
  }

  /**
   * Handles the mouseUp event - ends the drawing path
   */
  private mouseUp(e: MouseEvent | TouchEvent) {
    this.setDrawing(false);
  }

  /**
   * Handles the mouseDown event - begins a new drawing path
   */
  private mouseDown(e: MouseEvent | TouchEvent) {
    let coordinates;

    if ('touches' in e && e.touches.length > 0) {
      // It's a touch event
      const touch = e.touches[0];
      coordinates = this.getXYPosition({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    } else {
      // It's a mouse event
      coordinates = this.getXYPosition({
        clientX: (e as MouseEvent).clientX,
        clientY: (e as MouseEvent).clientY,
      });
    }

    this.setLastPosition(coordinates);
    this.setDrawing(true);

    this.context.beginPath();
    this.context.moveTo(coordinates.x, coordinates.y);
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
  private getXYPosition({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) {
    const rect = this.canvas!.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  /**
   * Handles the mousemove event - draws lines on the canvas
   */
  private pointerMove(e: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    let coordinates;
    let clientX;
    let clientY;
    if ('touches' in e && e.touches.length > 0) {
      // It's a touch event
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;

      coordinates = this.getXYPosition({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    } else {
      // It's a mouse event
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
      coordinates = this.getXYPosition({
        clientX: (e as MouseEvent).clientX,
        clientY: (e as MouseEvent).clientY,
      });
    }

    this.drawLine({ x: coordinates.x, y: coordinates.y, type: 'quadratic' });

    this.context.stroke();

    this.setLastPosition(coordinates);

    // check if the position is out of the canvas
    if (this.isOutOfCanvasBounds({ clientX, clientY })) {
      this.setDrawing(false);
    }
  }

  /**
   * Draw line to the newly set position
   */
  private drawLine({
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
   * Check if cursor is inside the canvas bounding rect
   * @param {MouseEvent} event - The mouse event
   * @returns {boolean} True if cursor is within canvas bounds
   */
  private isOutOfCanvasBounds({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }): boolean {
    const { x, y } = this.getXYPosition({ clientX, clientY });
    const rect = this.canvas!.getBoundingClientRect();

    // Check if x and y are within the canvas boundaries
    const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

    return !isInside;
  }

  /**
   * Clears the canvas and resets to the background color
   */
  clearCanvas() {
    if (!this.canvas) return console.warn('Unable to get canvas!');

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
   * Get  image size in bytes
   * @returns {number} Size in bytes
   */
  private getImageSize(): number {
    const dataUrl = this.canvas?.toDataURL('image/png') || '';
    // Data URL format: "data:image/png;base64,<base64string>"
    // Remove the data URL prefix to get actual base64 string
    const base64String = dataUrl.split(',')[1];

    if (!base64String) return 0;

    // Calculate bytes: base64 string length * 0.75
    // (base64 uses 4 characters to encode 3 bytes)
    const bytes = Math.ceil(base64String.length * 0.75);
    return bytes;
  }

  /**
   * Get exported image size in KB
   * @returns {number} Size in kilobytes
   */
  getExportedImageSize(format: 'kb' | 'mb' | 'b'): number {
    switch (format) {
      case 'mb':
        return this.getImageSize() / (1024 * 1024);
      case 'kb':
        return this.getImageSize() / 1024;
      default:
        return this.getImageSize();
    }
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
