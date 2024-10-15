import { ActionFunction, json } from "@remix-run/node";
import { z } from "zod";
import { createPodFromTemplate } from "~/services/api.server";

// Define the schema for the request body
const formSchema = z.object({
  templateId: z.number(),
  instanceId: z.number(),
});

export const action: ActionFunction = async ({ request }) => {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the body against the schema
    const { templateId, instanceId } = formSchema.parse(body);

    // Call the createPodFromTemplate function with the validated data
    const pod = await createPodFromTemplate(request, {
      template_id: templateId,
      instance_id: instanceId,
    });

    // Return the created pod or success response
    return json({ success: true, pod });
  } catch (error) {
    // Handle validation or server errors
    console.error(error);
    return json({ success: false, error: error }, { status: 400 });
  }
};
