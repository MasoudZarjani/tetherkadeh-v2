import {
  Injectable,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import jmoment from 'jalali-moment';
import { SettingService } from 'src/setting/setting.service';

interface JibitTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface JibitMatchResponse {
  matched: boolean;
  firstName?: string;
  lastName?: string;
  message?: string;
}

@Injectable()
export class JibitService implements OnModuleInit {
  private _settings: any;

  constructor(
    private readonly httpService: HttpService,
    private readonly settingService: SettingService,
  ) {}

  public async isActive(): Promise<boolean> {
    return this._settings.jibitActive;
  }

  private async _getJibitToken(): Promise<string | null> {
    if (!this._settings.jibitActive) {
      // console.log('Jibit service is not active. Skipping token generation.');
      return null;
    }
    if (!this._settings.jibitApiKey || !this._settings.jibitSecretKey) {
      console.error(
        'Jibit API key or secret key is missing. Cannot generate token.',
      );
      // Using a generic message as msg.jibitMisconfigured might not be available here
      throw new ServiceUnavailableException('Jibit service is misconfigured.');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post<JibitTokenResponse>(
          'https://napi.jibit.ir/ide/v1/tokens/generate',
          {
            apiKey: this._settings.jibitApiKey,
            secretKey: this._settings.jibitSecretKey,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      if (response.status < 200 || response.status >= 300) {
        console.error(
          `Jibit token generation failed: ${response.status} ${response.statusText}`,
          response.data,
        );
        throw new ServiceUnavailableException('Jibit token generation failed');
      }

      return response.data.accessToken;
    } catch (error) {
      console.error(
        'Error in JibitService _getJibitToken:',
        error.response?.data || error.message,
      );
      const status = error.response?.status || HttpStatus.SERVICE_UNAVAILABLE;
      const message =
        error.response?.data?.message ||
        'Error connecting to Jibit for token generation';
      throw new HttpException(message, status);
    }
  }

  async isNationalCodeMatchingMobile(
    nationalCode: string,
    mobileNumber: string,
  ): Promise<boolean> {
    if (!this._settings.jibitActive) {
      // console.log('Jibit service is not active. Defaulting to non-match for national code.');
      return false; // If Jibit is not active, assume it's not a match or handle as per business logic
    }

    const accessToken = await this._getJibitToken();
    if (!accessToken) {
      // Failed to get token, cannot proceed with matching
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<JibitMatchResponse>(
          `https://napi.jibit.ir/ide/v1/services/matching?mobileNumber=${mobileNumber}&nationalCode=${nationalCode}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const data = response.data;

      if (response.status < 200 || response.status >= 300) {
        console.error(
          `Jibit matching failed: ${response.status} ${response.statusText}`,
          data,
        );
        // In case of HTTP error, we might not have a Jibit-specific message in data.message
        // Consider it a failed match rather than throwing, as per "returns false if the Jibit request fails"
        return false;
      }

      return data.matched; // data.matched will be true or false
    } catch (error) {
      console.error(
        'Error in JibitService isNationalCodeMatchingMobile:',
        error.response?.data || error.message,
      );
      // As per requirement "returns false if the Jibit request fails"
      return false;
    }
  }

  async validateCardOwnership(cardNumber: string, user: any): Promise<any> {
    console.log(this._settings);
    if (!this._settings.jibitActive) {
      // console.log('Jibit service is not active. Defaulting to non-match for national code.');
      return false; // If Jibit is not active, assume it's not a match or handle as per business logic
    }

    const accessToken = await this._getJibitToken();
    console.log(accessToken);
    if (!accessToken) {
      // Failed to get token, cannot proceed with matching
      return false;
    }
    const birthDate = jmoment(user.birthday).locale('fa').format('YYYYMMDD');
    console.log(
      `https://napi.jibit.ir/ide/v1/services/matching?cardNumber=${cardNumber}&nationalCode=${user.nationalCode}&birthDate=${birthDate}`,
    );
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(
          `https://napi.jibit.ir/ide/v1/services/matching?cardNumber=${cardNumber}&nationalCode=${user.nationalCode}&birthDate=${birthDate}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const data = response.data;

      if (response.status < 200 || response.status >= 300) {
        console.error(
          `Jibit matching failed: ${response.status} ${response.statusText}`,
          data,
        );
        // In case of HTTP error, we might not have a Jibit-specific message in data.message
        // Consider it a failed match rather than throwing, as per "returns false if the Jibit request fails"
        return false;
      }

      return data.matched; // data.matched will be true or false
    } catch (error) {
      console.error(
        'Error in JibitService fetchIbanInfo:',
        error.response?.data || error.message,
      );
      // As per requirement "returns false if the Jibit request fails"
      return false;
    }
  }

  async fetchIbanInfo(cardNumber: string) {
    if (!this._settings.jibitActive) {
      // console.log('Jibit service is not active. Defaulting to non-match for national code.');
      return false; // If Jibit is not active, assume it's not a match or handle as per business logic
    }

    const accessToken = await this._getJibitToken();
    if (!accessToken) {
      // Failed to get token, cannot proceed with matching
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(
          `https://napi.jibit.ir/ide/v1/cards?number=${cardNumber}&iban=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const data = response.data;

      if (response.status < 200 || response.status >= 300) {
        console.error(
          `Jibit matching failed: ${response.status} ${response.statusText}`,
          data,
        );
        // In case of HTTP error, we might not have a Jibit-specific message in data.message
        // Consider it a failed match rather than throwing, as per "returns false if the Jibit request fails"
        return false;
      }

      return data; // data will contain the full response
    } catch (error) {
      console.error(
        'Error in JibitService fetchIbanInfo:',
        error.response?.data || error.message,
      );
      // As per requirement "returns false if the Jibit request fails"
      return false;
    }
  }

  async onModuleInit() {
    this._settings = await this.settingService.getSettings();
  }
}
