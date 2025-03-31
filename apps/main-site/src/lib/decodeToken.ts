import * as jose from 'jose'
import { ErrorHandler } from './ErrorHandler';


const jwtConfig = {
    secret: new TextEncoder().encode(process.env.JWT_SECRET),
}

export async function fetchUserDetails (token: any) {
    try {
        const decoded = await jose.jwtVerify(token, jwtConfig.secret)
        const userData = decoded.payload;
        return userData;
    } catch (error : any) {
        ErrorHandler(error);
        
    }
    
}