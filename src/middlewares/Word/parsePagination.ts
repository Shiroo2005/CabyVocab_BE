import { Request, Response, NextFunction } from 'express';
import { FindOptionsOrder } from 'typeorm'
import { Word } from '~/entities/word.entity';

// export const parsePagination = (req: Request, res: Response, next: NextFunction) => {
//   const page = parseInt(req.query.page as string, 10) || 1;
//   const limit = parseInt(req.query.limit as string, 10) || 10;

//   req.parseQueryPagination = { page, limit }; 
//   next();  // Tiếp tục xử lý request
// };




declare global {
  namespace Express {
    interface Request {
      parseQueryPagination?: { page: number; limit: number };
      sortParsed?: FindOptionsOrder<Word>;
    }
  }
}