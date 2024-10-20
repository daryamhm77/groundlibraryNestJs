import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

import { OwnerAuthGuard } from 'src/modules/owner/guards/owner-auth.guard';

export function AuthDecorator() {
  return applyDecorators(ApiBearerAuth('Authorization'), UseGuards(AuthGuard));
}
export function OwnerAuth() {
  return applyDecorators(
    ApiBearerAuth('Authorization'),
    UseGuards(OwnerAuthGuard),
  );
}
