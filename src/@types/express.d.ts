declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}

require('express-async-errors')
declare module 'express-async-errors'


