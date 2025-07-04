import type { IErrorResponse } from "../types/errors";
import type { IGetPlansResponse } from "../types/plans";
import api, { OK } from "./api";

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