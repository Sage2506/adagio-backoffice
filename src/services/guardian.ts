import type { IErrorResponse } from "../types/errors";
import type { IGuardianNew, IGuardianRecord, IPostGuardianResponse } from "../types/guardians";
import api, { CREATED, OK } from "./api"

const path = "/guardians";



export function postGuardian(args: { data: IGuardianNew }): Promise<IPostGuardianResponse | IErrorResponse> {
  return api.post<IGuardianRecord>(path, args.data).then(response => {
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

export function putGuardian(args: { id: number, data: IGuardianNew }): Promise<IPostGuardianResponse | IErrorResponse> {
  return api.put<IGuardianRecord>(`${path}`, args.data).then(response => {
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