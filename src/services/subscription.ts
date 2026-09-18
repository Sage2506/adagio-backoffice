import type { IErrorResponse } from "../types/errors";
import type { IDueDate, IGetSubscriptionsResponse, IPostSubscriptionResponse, ISubscriptionNew, ISubscriptionRecord } from "../types/subscriptions";
import api, { CREATED, OK } from "./api";

const path = "/subscriptions";

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

export function postSubscriptionAddCredit(args: { id: string, amount: number | string }): Promise<{ success: true, data: any } | { success: false, errors: { msj: string }[] }> {
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