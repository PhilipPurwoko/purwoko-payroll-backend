import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLE_KEY } from '../decorator/role.decorator';

interface RequestUser {
  role: string;

  [key: string]: any;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      ROLE_KEY,
      context.getHandler(),
    );
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as RequestUser;
    return user?.role === requiredRole;
  }
}
