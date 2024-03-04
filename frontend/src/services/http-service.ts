import apiClient from "./api-client";

interface Entity {
  id: number;
}

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll<T>() {
    const controller = new AbortController();
    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  getOne<T extends Entity>(entity: T) {
    return apiClient.get<T>(this.endpoint + "/" + entity.id);
  }

  updateAll<T>(data: number[]) {
    return apiClient.put<T>(this.endpoint, data);
  }

  updateOne<T>(id: number, data: number) {
    return apiClient.put<T>(this.endpoint + "/" + id, { data });
  }

  updateStatus<T>(id: number, data: object) {
    return apiClient.put<T>(this.endpoint + "/status/" + id, data);
  }
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;
