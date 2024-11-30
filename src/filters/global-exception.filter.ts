import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // TODO: VSCode ko scan dc class TokenExpiredError
        switch (true) {
            case response instanceof TokenExpiredError:
            case response instanceof JsonWebTokenError:
                const { statusCode, message } = this.handleErrorJWT(exception);
                response
                    .status(statusCode)
                    .json({
                        statusCode: statusCode,
                        message
                    });
                break;

            default:
                console.log(exception);
                response
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: exception.message || 'System error'
                    });
        }
    }

    private handleErrorJWT(exception: TokenExpiredError | JsonWebTokenError) {
        return {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: exception.message
        }
    }
}
