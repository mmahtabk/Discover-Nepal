export class ApiResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: Record<string, unknown>;

  constructor(data: T, meta?: Record<string, unknown>) {
    this.success = true;
    this.data = data;
    this.meta = meta;
  }

  static ok<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
    return new ApiResponse(data, meta);
  }
}