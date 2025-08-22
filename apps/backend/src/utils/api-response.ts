export class BlogbeeResponse {
  message: string;
  data?: unknown;

  constructor(
    message: string,
    data?: unknown,
  ) {
    this.message = message;
    this.data = data;
  }
}
