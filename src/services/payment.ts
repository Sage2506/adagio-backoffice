import axios from "axios";
import type { IErrorResponse } from "../types/errors";
import type { IGetPaymentsResponse, IPaymentNew, IPaymentRecord, IPostPaymentResponse } from "../types/payments";
import api, { CREATED, OK } from "./api";

const path = "/payments";

export function getPayments(args: { params?: string }): Promise<IGetPaymentsResponse | IErrorResponse> {
  return api.get<IGetPaymentsResponse>(`${path}?${args.params}`).then(response => {
    if (response.status === OK) {
      const { data, links, pages } = response.data
      return { success: true as const, data, links, pages };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

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
  }).catch(formatPaymentError);
}

interface PaymentErrorPayload {
  errors?: Record<string, string[]>
  error?: string
}

function formatPaymentError(error: unknown): IErrorResponse {
  if (axios.isAxiosError<PaymentErrorPayload>(error)) {
    const payload = error.response?.data;
    if (payload?.errors) {
      return {
        success: false,
        errors: Object.entries(payload.errors).flatMap(([field, messages]) =>
          messages.map(message => ({ msj: field === "base" ? message : `${field}: ${message}` }))
        )
      };
    }

    return { success: false, errors: [{ msj: payload?.error || error.message }] };
  }

  return { success: false, errors: [{ msj: "Unable to register payment" }] };
}