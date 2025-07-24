import type { IErrorResponse } from "../types/errors";
import type { IGetOrderResponse, IGetOrdersResponse, IOrderNew, IOrderRecord } from "../types/orders";
import api, { CREATED, OK } from "./api";

const path = "/orders";

export function getOrders(args: { params?: string }): Promise<IGetOrdersResponse | IErrorResponse> {
  return api.get<IGetOrdersResponse>(`${path}?${args.params}`).then(response => {
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

export function getOrder(args: { id: string }): Promise<IGetOrderResponse | IErrorResponse> {
  return api.get<IOrderRecord>(`${path}/${args.id}`).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

export function postOrder(args: { data: IOrderNew }): Promise<IGetOrderResponse | IErrorResponse> {
  return api.post<IOrderRecord>(path, args.data).then(response => {
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

export function putOrder(args: { id: string, data: { order: IOrderNew } }): Promise<IGetOrderResponse | IErrorResponse> {
  return api.put<IOrderRecord>(`${path}/${args.id}`, args.data).then(response => {
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