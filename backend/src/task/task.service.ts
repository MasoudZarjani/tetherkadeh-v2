import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SymbolService } from 'src/symbol/symbol.service';

@Injectable()
export class TaskService {
  constructor(private readonly symbolService: SymbolService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.symbolService.getFromExternalSources();
  }
}
