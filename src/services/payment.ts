import type { IErrorResponse } from "../types/errors";
import type { IPaymentNew, IPaymentRecord, IPostPaymentResponse } from "../types/payments";
import api, { CREATED } from "./api";

const path = "/payments";

export function postPayment(args: { data: IPaymentNew }): Promise<IPostPaymentResponse | IErrorResponse> {
  return api.post<IPaymentRecord>(path, args.data).then(response => {
    if (response.status === CREATED) {
      return {
        success: true as const,
        data: response.data
      };
    } else {
      return {
        success: false as const,
        errors: [{ msj: response.status.toString() }]
      };
    }
  }).catch((error: { message: string }) => {
    return {
      success: false as const,
      errors: [{ msj: error.message }]
    };
  });
}