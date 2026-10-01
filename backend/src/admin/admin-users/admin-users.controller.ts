import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string
  ) {
    return this.adminUsersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminUserDto: any, @Req() req: any) {
    return this.adminUsersService.updateUser(id, updateAdminUserDto, req.user.userId);
  }
}
