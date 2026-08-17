import type { IErrorResponse } from "../types/errors";
import type { IGetGuardiansResponse, IGuardianNew, IGuardianRecord, IPostGuardianResponse } from "../types/guardians";
import api, { CREATED, OK } from "./api"

const path = "/guardians";

export function getGuardians(args: { query: string, signal?: AbortSignal }): Promise<IGetGuardiansResponse | IErrorResponse> {
  return api.get<{ data: IGuardianRecord[] }>(path, {
    params: { query: args.query },
    signal: args.signal
  }).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data.data };
    }
    return { success: false as const, errors: [{ msj: response.status.toString() }] };
  }).catch((error: { code?: string, message: string }) => {
    return { success: false as const, errors: [{ msj: error.message }] };
  });
}

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
  return api.put<IGuardianRecord>(`${path}/${args.id}`, args.data).then(response => {
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