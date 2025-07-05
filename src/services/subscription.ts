import type { IErrorResponse } from "../types/errors";
import type { IGetSubscriptionsResponse, IPostSubscriptionResponse, ISubscriptionNew, ISubscriptionRecord } from "../types/subscriptions";
import api, { CREATED, OK } from "./api";

const path = "/subscriptions";

export function getSubscriptions(args: { params?: string }): Promise<IGetSubscriptionsResponse | IErrorResponse> {
  return api.get<IGetSubscriptionsResponse>(`${path}?${args.params}`).then(response => {
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