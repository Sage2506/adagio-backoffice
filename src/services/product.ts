import type { IErrorResponse } from "../types/errors";
import type { IGetProductResponse, IGetProductsResponse, IProductNew, IProductRecord } from "../types/products";
import api, { CREATED, OK } from "./api";

const path = "/products";

export function getProducts(args: { params?: string }): Promise<IGetProductsResponse | IErrorResponse> {
  return api.get<IGetProductsResponse>(`${path}?${args.params}`).then(response => {
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

export function getProduct(args: { id: string }): Promise<IGetProductResponse | IErrorResponse> {
  return api.get<IProductRecord>(`${path}/${args.id}`).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

export function postProduct(args: { data: { product: IProductNew } }): Promise<IGetProductResponse | IErrorResponse> {
  return api.post<IProductRecord>(path, args.data).then(response => {
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

export function putProduct(args: { id: string, data: { product: IProductNew } }): Promise<IGetProductResponse | IErrorResponse> {
  return api.put<IProductRecord>(`${path}/${args.id}`, args.data).then(response => {
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