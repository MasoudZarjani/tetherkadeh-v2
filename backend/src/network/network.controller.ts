import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { NetworkService } from './network.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminRole } from 'src/admin/enums/AdminRole.enum';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ListNetworkDto } from './dto/list-network.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/v1/network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Post()
  create(@Body() createNetworkDto: CreateNetworkDto) {
    return this.networkService.create(createNetworkDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNetworkDto: UpdateNetworkDto) {
    return this.networkService.update(id, updateNetworkDto);
  }

  @Get()
  findAll() {
    return this.networkService.findAll();
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin')
  findForAdmin(@Query() listNetworkDto: ListNetworkDto) {
    return this.networkService.findForAdmin(listNetworkDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('symbol/:symbol')
  findWithSymbol(@Param('symbol') symbol: string) {
    return this.networkService.findWithSymbol(symbol);
  }
}
