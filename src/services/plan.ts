import type { IErrorResponse } from "../types/errors";
import type { IGetPlanResponse, IGetPlansResponse, IPlanNew, IPlanRecord } from "../types/plans";
import api, { CREATED, OK } from "./api";

const path = "/plans";

export function getPlans(args: { params?: string }): Promise<IGetPlansResponse | IErrorResponse> {
  return api.get<IGetPlansResponse>(`${path}?${args.params}`).then(response => {
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

export function getPlan(args: { id: string }): Promise<IGetPlanResponse | IErrorResponse> {
  return api.get<IPlanRecord>(`${path}/${args.id}`).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

export function postPlan(args: { data: { plan: IPlanNew } }): Promise<IGetPlanResponse | IErrorResponse> {
  return api.post<IPlanRecord>(path, args.data).then(response => {
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

export function putPlan(args: { id: string, data: { plan: IPlanNew } }): Promise<IGetPlanResponse | IErrorResponse> {
  return api.put<IPlanRecord>(`${path}/${args.id}`, args.data).then(response => {
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