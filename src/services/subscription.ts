import type { IErrorResponse } from "../types/errors";
import type { IDueDate, IGetSubscriptionsResponse, IPostSubscriptionResponse, ISubscriptionNew, ISubscriptionRecord } from "../types/subscriptions";
import api, { CREATED, OK } from "./api";

const path = "/subscriptions";

export function exportSubscriptions(args: { params?: string }): Promise<Blob | IErrorResponse> {
  return api.get(`${path}?export=excel&${args.params || ""}`, { responseType: "blob" }).then(response => {
    if (response.status === OK) {
      return response.data as Blob;
    }

    return { success: false as const, errors: [{ msj: response.status.toString() }] };
  }).catch(error => ({
    success: false as const,
    errors: [{ msj: error.message }]
  }));
}

export function getSubscriptions(args: { params?: string }): Promise<IGetSubscriptionsResponse | IErrorResponse> {
  return api.get<IGetSubscriptionsResponse>(`${path}?${args.params}`).then(response => {
    if (response.status === OK) {
      const { data, links, pages, total } = response.data
      return { success: true as const, data, links, pages, total };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

export function postSubscription(args: { data: ISubscriptionNew }): Promise<IPostSubscriptionResponse | IErrorResponse> {
  return api.post<ISubscriptionRecord>(path, args.data).then(response => {
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

export function putSubscription(args: { id: string, data: ISubscriptionNew }): Promise<IPostSubscriptionResponse | IErrorResponse> {
  return api.put<ISubscriptionRecord>(`${path}/${args.id}`, args.data).then(response => {
    if (response.status === OK) {
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

export function putSubscriptionDueDate(args: { id: string, data: IDueDate }): Promise<IPostSubscriptionResponse | IErrorResponse> {
  return api.put<ISubscriptionRecord>(`${path}/${args.id}`, args.data).then(response => {
    if (response.status === OK) {
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

export function postSubscriptionAddCredit(args: { id: string, amount: number | string }): Promise<{ success: true, data: unknown } | { success: false, errors: { msj: string }[] }> {
  return api.post(`${path}/${args.id}/add_credit`, { amount: Number(args.amount) }).then(response => {
    if (response.status === OK) {
      return {
        success: true as const,
        data: response.data
      };
    }

    return {
      success: false as const,
      errors: [{ msj: response.status.toString() }]
    };
  }).catch((error: { response?: { data?: { error?: string } }, message: string }) => {
    const backendError = error.response?.data?.error;
    return {
      success: false as const,
      errors: [{ msj: backendError || error.message }]
    };
  });
}

export function getMonthlyIncome(): Promise<{ success: true, total: number } | { success: false, errors: { msj: string }[] }> {
  return api.get<{ total: number }>(`${path}/monthly_income`).then(response => {
    if (response.status === OK) {
      return { success: true as const, total: Number(response.data.total || 0) };
    }

    return { success: false as const, errors: [{ msj: response.status.toString() }] };
  }).catch((error: { message: string }) => {
    return { success: false as const, errors: [{ msj: error.message }] };
  });
}