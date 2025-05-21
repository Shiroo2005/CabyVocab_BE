import { config } from 'dotenv'
import { env } from 'process'
import { HashAlgorithm, ignoreLogger, VNPay } from 'vnpay'
config()
export const vnpay = new VNPay({
  tmnCode: '9E7HMEQ7',
  // tmnCode: env.VNPAY_TMnCode as string,
  secureSecret: 'FC52YAR0TS03CVGB8NKE4X61XNXB3069',
  // env.VNPAY_SecretKey as string,
  vnpayHost: env.VNPAY_HOST as string,

  // Cấu hình tùy chọn
  testMode: true, // Chế độ test
  hashAlgorithm: HashAlgorithm.SHA512, // Thuật toán mã hóa
  enableLog: true, // Bật/tắt ghi log
  loggerFn: ignoreLogger, // Hàm xử lý log tùy chỉnh

  // Tùy chỉnh endpoints cho từng phương thức API (mới)
  // Hữu ích khi VNPay thay đổi endpoints trong tương lai
  endpoints: {
    paymentEndpoint: 'paymentv2/vpcpay.html', // Endpoint thanh toán
    queryDrRefundEndpoint: 'merchant_webapi/api/transaction', // Endpoint tra cứu & hoàn tiền
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list' // Endpoint lấy danh sách ngân hàng
  }
})
console.log(vnpay)
