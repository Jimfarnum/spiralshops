/**
 * Extended Express types for SPIRAL platform
 */

import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role?: string;
        email?: string;
      };
      startTime?: number;
    }

    interface Response {
      standard?: (data: any, status?: number) => void;
    }
  }
}

// Extend global for garbage collection
declare global {
  var gc: (() => void) | undefined;
}

export {};