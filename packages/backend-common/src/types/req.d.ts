// backend/src/types/req.d.ts
export interface requestUser{
    _id : string,
    username: string,
    // fullName : string,
    // gender : string,
    email : string,
    // profilePic : string
  }
  
  declare global {
    namespace Express {
      interface Request {
        user?: requestUser; // The user property, which will be set by middleware
      }
    }
  }
  
  export {}; // Ensure this file is treated as a module
  