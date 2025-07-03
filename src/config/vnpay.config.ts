import { config } from 'dotenv'
config()

export const vnpay = async () => {
  const { HashAlgorithm, ignoreLogger, VNPay } = await import('vnpay')

  return new VNPay({
    tmnCode: '9E7HMEQ7',
    secureSecret: 'FC52YAR0TS03CVGB8NKE4X61XNXB3069',
    vnpayHost: process.env.VNPAY_HOST as string,
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: true,
    loggerFn: ignoreLogger,
    endpoints: {
      paymentEndpoint: 'paymentv2/vpcpay.html',
      queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
      getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list'
    }
  })
}
