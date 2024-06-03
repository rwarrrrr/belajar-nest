import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';

export const Auth = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest()
        return req.user
    }
)
