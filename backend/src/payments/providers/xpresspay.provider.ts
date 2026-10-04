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
      }
    }

    const stringToSign = pairs.join('&') + '&key=' + this.appSecret;
    return crypto.createHash('sha256').update(stringToSign).digest('hex').toLowerCase();
  }

  async initiateDeposit(amount: number, reference: string, metadata: any) {
    try {
      const { customerMobile, customerName, channel } = metadata;

      // Clean mobile number (strip non-digits, ensure starts with 0)
      let mobile = customerMobile.replace(/[^0-9]/g, '');
      if (mobile.startsWith('920')) mobile = '0' + mobile.substring(3);
      else if (mobile.startsWith('92') && mobile.length === 12) mobile = '0' + mobile.substring(2);
      else if (mobile.length === 10 && mobile.startsWith('3')) mobile = '0' + mobile;

      const payload: Record<string, any> = {
        appId: this.appId,
        merOrderNo: reference,
        amount: Number(amount),
        channel: channel.toUpperCase(), // EASYPAISA or JAZZCASH
        customerMobile: mobile || '03001234567',
        customerName: customerName || 'Player',
        notifyUrl: this.notifyUrl,
        returnUrl: this.returnUrl,
      };

      payload['sign'] = this.generateSignature(payload);

      this.logger.log(`Initiating XpressPay deposit for ${reference}`);

      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 25000,
      });

      const respData = response.data;
      this.logger.log(`XpressPay Response: ${JSON.stringify(respData)}`);

      const code = respData?.code;
      const isSuccess = (code === 0 || code === '0' || String(respData?.msg).toLowerCase() === 'success');

      if (!isSuccess) {
        throw new Error(respData?.msg || 'Payment gateway rejected order creation');
      }

      // Extract details
      const payUrl = respData?.data?.params?.paymentLink || respData?.data?.paymentLink || respData?.payUrl || '';
      const gatewayOrderNo = respData?.data?.orderNo || respData?.orderNo || respData?.gatewayOrderNo || '';

      return {
        success: true,
        payment_url: payUrl,
        gatewayOrderNo,
        message: 'Payment session initialized',
      };
    } catch (error: any) {
      this.logger.error('Failed to initiate XpressPay deposit', error?.response?.data || error.message);
      throw error;
    }
  }

  verifyWebhookSignature(payload: any): boolean {
    if (!payload || !payload.sign) return false;
    const receivedSign = String(payload.sign);
    const calculatedSign = this.generateSignature(payload);
    return calculatedSign === receivedSign.toLowerCase();
  }
}
