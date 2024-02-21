class HttpException extends Error {
  public message: string;
  public statusCode: number;
  public fails: object | null;

  constructor(message: string = 'Internal server error', statusCode: number = 500, fails: object | null = null) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = 'HttpException';
    this.fails = fails;
    
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export default HttpException;