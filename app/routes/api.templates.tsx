import { ActionFunction } from "@remix-run/node";
import {
  ApiResponse,
  sendRequest,
  toCamelCase,
} from "~/services/api.base.server";

// Define the type for the pod data if needed
export interface Template {
  id: number;
  status: string;
  image: string;
  containerId: string;
  entrypoint: string;
  cmd: string;
  updatedAt: string; // `updated_at`
  createdAt: string; // `created_at`
}

// Function to list pods from the /pods API
async function createTemplate(request: Request): Promise<any> {
  const body = await request.json();

  const response = await sendRequest<ApiResponse<[]>>(request, "/templates", {
    method: "POST",
    body: JSON.stringify(body),
  });
  // Return the 'data' field, which contains the actual array of pods
  const result = toCamelCase(response.data);
  return result;
}

// Function to list pods from the /pods API
async function listTemplates(request: Request): Promise<any> {
  const response = await sendRequest<ApiResponse<[]>>(request, "/templates");
  // Return the 'data' field, which contains the actual array of pods
  const result = toCamelCase(response.data);
  return result;
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "GET":
      return listTemplates(request);
    case "POST":
      return createTemplate(request);
  }
  return null;
};
