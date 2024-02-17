import { Response } from 'express';

class SendResponse {
  private res: Response;

  constructor(res: Response) {
    this.res = res;
  }

  sendJson(doc: any, message: string, statusCode: number): Response {
    return this.res.status(statusCode).json({
      status: 'SUCCESS',
      message,
      size: Array.isArray(doc) ? doc.length : 1, 
      data: doc,
    });
  }
}

export default SendResponse;
