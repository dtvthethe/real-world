import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "./user.entity";

// only loop 1 times
const NUMBER_OF_PASSWORD_LOOPS = 1;
const SECRET_KEY = 'abc';

export class AuthService {
    // create password
    createPassword = (password: string) => {
        return bcrypt.hash(password, NUMBER_OF_PASSWORD_LOOPS);
    }

    // compare password
    comparePassword = (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword);
    }

    // generate access token
    generateAccessToken = (user: User) => {
        const payload = {
            sub: user.id,
            username: user.userName,
            email: user.email,
        };
        const options = {
            expiresIn: '3m',
        }

        return jwt.sign(payload, SECRET_KEY, options);
    }

    // validate token
    validateToken = (token: string) => {
        return jwt.verify(token, SECRET_KEY);
    }
}
