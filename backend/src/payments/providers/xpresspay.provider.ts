import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class XpressPayProvider {
  private readonly logger = new Logger(XpressPayProvider.name);
  private readonly appId = 'bv9qmvpxw292192pt43itven';
  private readonly appSecret = '628ccd6f8af470cbc820c7743a45c1f0ca01b08f07f70a62';
  private readonly apiUrl = 'https://xpresspay.cloud/api/v2/payment/order/create';
  private readonly notifyUrl = 'https://8111c.com/api/v1/payments/webhook';
  private readonly returnUrl = 'https://8111c.com/profile';

  generateSignature(params: Record<string, any>): string {
    const clone = { ...params };
    delete clone['sign'];

    // Sort keys alphabetically
    const keys = Object.keys(clone).sort();
    const pairs = [];

    for (const key of keys) {
      const val = clone[key];
      if (val !== '' && val !== null && val !== undefined) {
        pairs.push(`${key}=${val}`);
      
  
  async checkOrderStatus(merOrderNo: string): Promise<boolean> {
    try {
      const payload: Record<string, any> = { appId: this.appId, merOrderNo };
      payload['sign'] = this.generateSignature(payload);
      const response = await require('axios').post('https://xpresspay.cloud/api/v2/payment/order/query', payload, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        timeout: 10000,
      });
      const data = response.data;
      if (data && (data.code == 0 || data.code == '0') && data.data && String(data.data.orderStatus) === '2') {
        return true;
      }
      return false;
    } catch (e: any) {
      this.logger.error('Failed to query XpressPay status ' + e.message);
      return false;
    }
  }
}
