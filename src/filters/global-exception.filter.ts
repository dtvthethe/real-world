import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        response
            .status(status)
            .json({
                statusCode: status,
                message: exception.message
            });
    }
}
