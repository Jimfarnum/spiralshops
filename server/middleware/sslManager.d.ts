import { RequestHandler } from 'express';

export declare class SSLManager {
  validateCertificate(hostname: string): Promise<any>;
  getCertificateStatus(hostname: string): any;
}

export declare const sslManager: SSLManager;
export declare const sslStatusMiddleware: RequestHandler;
export declare const sslHealthCheck: RequestHandler;