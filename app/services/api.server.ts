import { Pod } from "~/routes/api.pods";
import { ApiResponse, sendRequest, toCamelCase } from "./api.base.server";

// Define the type for the pod data if needed
export interface CreatePodFromTemplate {
  template_id: number;
  instance_id: number;
}

export interface Template {
  id: number;
  instanceId: number;
  image: string;
  name: string;
  status: string;
  entrypoint: string;
  command: string[] | null;
  updatedAt: string; // `updated_at`
  createdAt: string; // `created_at`
}

// Function to list pods from the /pods API
export async function listPods(request: Request): Promise<any> {
  const response = await sendRequest<ApiResponse<[Pod]>>(request, "/pods");

  // Return the 'data' field, which contains the actual array of pods
  const result = toCamelCase(response.data);
  console.log("[listPods] result: , ", result);

  return result;
}

export async function deletePods(
  request: Request,
  podId: number
): Promise<any> {
  const response = await sendRequest<ApiResponse<Pod>>(
    request,
    `/pods/${podId}`,
    { method: "DELETE" }
  );

  // Return the 'data' field, which contains the actual array of pods
  const result = toCamelCase(response.data);
  // const result = response.data;
  console.log("[deletePods] result: , ", result);

  return result;
}

// Function to list pods from the /pods API
export async function createPodFromTemplate(
  request: Request,
  body: CreatePodFromTemplate
): Promise<any> {
  const response = await sendRequest<ApiResponse<CreatePodFromTemplate[]>>(
    request,
    "/pods/from_template",
    { method: "POST", body: JSON.stringify(body) }
  );

  // Return the 'data' field, which contains the actual array of pods
  const result = toCamelCase(response.data);
  console.log("[createPodFromTemplate] result, ", result);

  return result;
}

// Function to list templates from the /templates API
export async function listTemplates(request: Request): Promise<any> {
  const response = await sendRequest<ApiResponse<Template[]>>(
    request,
    "/templates"
  );

  // Return the 'data' field, which contains the actual array of templates
  const result = toCamelCase(response.data);
  console.log("[listTemplates] result, ", result);

  return result;
}

// Define the type for the instance data if needed
export interface Instance {
  id: number;
  hostname: string;
  status: string;
  gpuType: string; // `gpu_type` in the API response
  gpuCount: number; // `gpu_count`
  gpuMemory: number; // `gpu_memory` in MB
  gpuCudaVersion: string; // `gpu_cuda_version`
  gpuDriverVersion: string; // `gpu_driver_version`
  publicIp: string; // `public_ip`
  updatedAt: string; // `updated_at`
  createdAt: string; // `created_at`
}

// Function to list instances from the /instances API
export async function listInstances(request: Request): Promise<any> {
  const response = await sendRequest<ApiResponse<Instance[]>>(
    request,
    "/instances"
  );

  // Return the 'data' field, which contains the actual array of instances
  const result = toCamelCase(response.data);
  console.log("result, ", result);

  return result;
}
