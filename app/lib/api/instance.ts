import { ApiResponse, sendRequest, toCamelCase } from "./base"; // Importing the response type interface

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
