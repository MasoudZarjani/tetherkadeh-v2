import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UpdateSettingDto, UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('api/v1/setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  // گرفتن همه تنظیمات
  @Get()
  async getAllSettings() {
    return this.settingService.getSettings();
  }

  // گرفتن یک تنظیم خاص
  @Get(':key')
  async getSetting(@Param('key') key: string) {
    return { key, value: await this.settingService.get(key) };
  }

  // آپدیت یا اضافه کردن یک تنظیم
  @Post()
  async updateSetting(@Body() dto: UpdateSettingDto) {
    await this.settingService.set(dto.key, dto.value);
    return { success: true };
  }

  // آپدیت چند تنظیم یکجا
  @Post('bulk')
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    await this.settingService.updateSettings(dto.settings);
    return { success: true };
  }

  @Post('load-defaults')
  async loadDefaults() {
    await this.settingService.loadDefaultSettings();
    return { success: true, message: 'Default settings loaded successfully.' };
  }

  @Get('site-info')
  siteInfo() {
    return this.settingService.siteInfo();
  }
}
