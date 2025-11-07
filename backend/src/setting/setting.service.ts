import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Setting, SettingDocument } from './entities/setting.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import * as defaultSettings from '../utils/settings.json';

const SETTINGS_KEY = 'settings';

@Injectable()
export class SettingService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async getSettings(): Promise<Record<string, any>> {
    let resp: any = await this.cacheManager.get(SETTINGS_KEY);

    if (!resp) {
      const settings = await this.settingModel.find().lean();
      const mapped = settings.reduce(
        (acc, s) => ({ ...acc, [s.key]: s.value }),
        {},
      );

      await this.cacheManager.set(SETTINGS_KEY, JSON.stringify(mapped), 3600);
      resp = JSON.stringify(mapped);
    }

    return JSON.parse(resp);
  }

  async updateSettings(newSettings: Record<string, any>): Promise<void> {
    const current = (await this.getSettings()) || {};
    const merged = { ...current, ...newSettings };

    for (const key of Object.keys(newSettings)) {
      await this.settingModel.findOneAndUpdate(
        { key },
        { value: newSettings[key] },
        { upsert: true, new: true },
      );
    }

    await this.cacheManager.set(SETTINGS_KEY, JSON.stringify(merged), 3600);
  }

  async get(key: string): Promise<any> {
    const settings = await this.getSettings();
    return settings[key];
  }

  async set(key: string, value: any): Promise<void> {
    await this.updateSettings({ [key]: value });
  }

  async setCache(key: string, value: any): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async getCache(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async loadDefaultSettings(): Promise<void> {
    const defaults = defaultSettings as Record<string, any>;

    for (const key of Object.keys(defaults)) {
      await this.settingModel.findOneAndUpdate(
        { key },
        { value: defaults[key] },
        { upsert: true, new: true },
      );
    }

    // آپدیت کش بعد از ذخیره‌سازی
    await this.cacheManager.set(SETTINGS_KEY, JSON.stringify(defaults));
  }

  async siteInfo() {
    const settings = await this.getSettings();
    return {
      siteName: settings.siteName,
      logoText: settings.logoText,
      logoMobile: settings.logoMobile,
      logoDark: settings.logoDark,
      faviconDark: settings.faviconDark,
      favicon: settings.favicon,
      logoTextDark: settings.logoTextDark,
      logoMobileDark: settings.logoMobileDark,
      version: settings.version,
      mobile: settings.mobile,
      phone: settings.phone,
      address: settings.address,
      email: settings.email,
      telegram: settings.telegram,
      instagram: settings.instagram,
      twitter: settings.twitter,
      facebook: settings.facebook,
      youtube: settings.youtube,
      linkedin: settings.linkedin,
      whatsapp: settings.whatsapp,
      map: settings.map,
      activeGateway: settings.activeGateway,
      frontendUrl: settings.frontendUrl,
      backendUrl: settings.backendUrl,
      activeKyc: settings.activeKyc,
      defaultLanguage: settings.defaultLanguage,
      goftinoKey: settings.goftinoKey ? settings.goftinoKey : null,
      languages: settings.languages,
      kycIntro: settings.kycIntro,
      kycText: settings.kycText,
      kycWithPhoto: settings.kycWithPhoto,
      kycWithVideo: settings.kycWithVideo,
      depositApproved: settings.depositApproved,
      depositTrusted: settings.depositTrusted,
      identifiedInfo: settings.identifiedInfo || [],
      theme: settings.theme,
    };
  }
}
