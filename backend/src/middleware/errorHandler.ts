import {Request, Response, NextFunction} from 'express';
export const errorHandler=(err: Error, req: Request, res: Response, _next: NextFunction): void=>{
  console.error('Unhandled error:', err.message);
  res.status(500).json({error: 'Internal server error'});
};
