import { sendChatRequest } from "./chat";

export interface ArchitectureRequest {
  platform: string;
  model: string;
  features: string[];
  useCase: string;
}

export interface ArchitectureResponse {
  summary: string;
  diagram: string; // Text description of diagram
  steps: string[];
  securityConsiderations: string[];
}

export async function generateArchitecture(req: ArchitectureRequest): Promise<ArchitectureResponse> {
  const prompt = `
    As a Senior Solution Architect for Anthropic, design a high-level architecture for the following stack:
    
    Platform: ${req.platform}
    Model: ${req.model}
    Key Features: ${req.features.join(", ")}
    Use Case: ${req.useCase}

    Please provide a structured response in JSON format with the following keys:
    - summary: A 2-sentence executive summary.
    - diagram: A text-based description of the data flow.
    - steps: An array of 5 high-level deployment steps.
    - securityConsiderations: An array of 3 critical security controls.

    Do not include markdown code blocks in the response, just the raw JSON string.
  `;

  try {
    const response = await sendChatRequest({
      prompt,
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.2,
      maxTokens: 1024,
      systemPrompt: "You are an expert Enterprise Architect specializing in LLM deployments. Output strictly valid JSON."
    });

    const data = await response.json();
    const content = data.content[0].text;
    
    // Parse the JSON content
    try {
        return JSON.parse(content);
    } catch (e) {
        console.error("Failed to parse architect JSON", content);
        throw new Error("Failed to generate architecture.");
    }

  } catch (error) {
    console.error("Architecture Generation Error:", error);
    // Fallback Mock Response if API fails (graceful degradation)
    return {
      summary: "High-availability deployment leveraging Claude Enterprise capabilities with robust security boundaries.",
      diagram: "User -> Load Balancer -> App Service -> Claude API (via PrivateLink)",
      steps: [
        "Provision IAM roles and Identity Center integration",
        "Configure VPC endpoints for secure connectivity",
        "Deploy application container to ECS/EKS",
        "Implement PII redaction middleware",
        "Conduct UAT with pilot group"
      ],
      securityConsiderations: [
        "Enforce TLS 1.3 for all transit",
        "Enable audit logging for all prompt interactions",
        "Rotate API keys automatically via Secrets Manager"
      ]
    };
  }
}
