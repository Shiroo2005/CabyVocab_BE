import { VnpLocale } from 'vnpay'
import { vnpay } from '~/config/vnpay.config'
import { Order } from '~/entities/order.entity'

class VnPayService {
  createPaymentUrl = (order: Order, ip: string) => {
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: order.amount,
      vnp_IpAddr: ip,
      // req.headers['x-forwarded-for'] ||
      // req.connection.remoteAddress ||
      // req.socket.remoteAddress ||
      // req.ip,
      vnp_TxnRef: order.id.toString(),
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
      vnp_ReturnUrl: 'http://localhost:8081/orders/vnpay-return', // Đường dẫn nên là của frontend
      vnp_Locale: VnpLocale.VN
    })

    return paymentUrl
  }
}

export const vnPayService = new VnPayService()
