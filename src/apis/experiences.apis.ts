import { experienceModel } from "../models/experience.model";
import { httpApi } from "./http.api";

export interface responseAll {
  message: string;
  statusCode: Number;
  data: {
    experiences: experienceModel[];
  };
  errors: string[];
}

export interface responseDetail {
  message: string;
  statusCode: Number;

  data: {
    experiences: experienceModel;
  };
  errors: string[];
}

export const CreateExperiences = (req: experienceModel): Promise<responseAll> =>
  httpApi.post<responseAll>(`experiences`, req).then(({ data }) => data);

export const UpdateExperience = (
  id: string,
  req: experienceModel
): Promise<responseDetail> =>
  httpApi
    .patch<responseDetail>(`experiences/${id}`, req)
    .then(({ data }) => data);

export const GetExperiences = (): Promise<responseAll> =>
  httpApi.get<responseAll>(`experiences`).then(({ data }) => data);

export const GetExperienceDetail = (id: string): Promise<responseDetail> =>
  httpApi.get<responseDetail>(`experiences/${id}`).then(({ data }) => data);
