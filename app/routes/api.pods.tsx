import { ActionFunction, json } from "@remix-run/node";

import { deletePods, listPods } from "~/services/api.server";

// Define the type for the pod data if needed
export interface Pod {
  id: number;
  status: string;
  image: string;
  instanceId: number;
  containerId: string;
  entrypoint: string;
  cmd: string[];
  updatedAt: string; // `updated_at`
  createdAt: string; // `created_at`
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "GET":
      return listPods(request);
    case "DELETE":
      const { podID } = await request.json();
      return deletePods(request, podID);
  }
  return null;
};
