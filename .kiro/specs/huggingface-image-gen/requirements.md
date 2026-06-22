# Requirements Document

## Introduction

This document specifies requirements for integrating Hugging Face Inference API as a free alternative image generation provider in NEXUS AI. The feature enables users to generate images using FLUX and Stable Diffusion models through Hugging Face's free Inference API without requiring GPU resources or local model installation. The integration provides a fallback mechanism when OpenAI DALL-E is unavailable and allows users to choose between different image generation models.

## Glossary

- **Image_Service**: The client-side TypeScript service that coordinates image generation requests
- **Image_Gen_Function**: The Supabase Edge Function that handles server-side image generation API calls
- **Hugging_Face_Provider**: The image generation provider using Hugging Face Inference API
- **OpenAI_Provider**: The existing image generation provider using OpenAI DALL-E 3
- **Model_Selection**: User interface component allowing selection between available image generation models
- **Intent_Classifier**: The system component that determines user intent from chat messages
- **Image_Result_Component**: The React component that displays generated images in the chat interface
- **Provider_Fallback**: The mechanism that switches from OpenAI to Hugging Face when OpenAI is unavailable
- **Free_Tier**: Hugging Face API access that requires only an API token without payment
- **FLUX_Model**: Hugging Face text-to-image models including FLUX.1-dev and FLUX.1-schnell
- **Stable_Diffusion_Model**: Stable Diffusion XL text-to-image model available on Hugging Face
- **API_Token**: Authentication credential for Hugging Face Inference API

## Requirements

### Requirement 1: Hugging Face Provider Integration

**User Story:** As a developer, I want to integrate Hugging Face Inference API as an image generation provider, so that NEXUS AI can generate images using free models without GPU requirements.

#### Acceptance Criteria

1. THE Image_Gen_Function SHALL support Hugging Face Inference API as a provider option
2. WHEN a Hugging Face model is selected, THE Image_Gen_Function SHALL authenticate using the Hugging Face API_Token from environment variables
3. THE Image_Gen_Function SHALL send text-to-image generation requests to Hugging Face Inference API endpoint
4. WHEN Hugging Face API returns a successful response, THE Image_Gen_Function SHALL return the generated image URL or base64 data
5. IF Hugging Face API returns an error response, THEN THE Image_Gen_Function SHALL return a descriptive error message
6. THE Image_Service SHALL pass the selected provider and model information to the Image_Gen_Function

### Requirement 2: Multiple Model Support

**User Story:** As a user, I want to choose between different image generation models, so that I can select the best model for my needs.

#### Acceptance Criteria

1. THE Image_Gen_Function SHALL support FLUX.1-dev model for high-quality image generation
2. THE Image_Gen_Function SHALL support FLUX.1-schnell model for fast image generation
3. THE Image_Gen_Function SHALL support Stable Diffusion XL model for image generation
4. THE Image_Gen_Function SHALL support DALL-E 3 model for OpenAI-based image generation
5. WHEN a specific model is requested, THE Image_Gen_Function SHALL use the correct API endpoint and parameters for that model
6. THE Model_Selection SHALL display all available image generation models with provider labels
7. THE Model_Selection SHALL indicate which models are free tier compatible

### Requirement 3: Provider Fallback Mechanism

**User Story:** As a user, I want the system to automatically use Hugging Face when OpenAI is unavailable, so that I can still generate images without manual configuration.

#### Acceptance Criteria

1. WHEN OpenAI API_Token is not configured in environment variables, THE Image_Service SHALL default to Hugging_Face_Provider
2. IF OpenAI_Provider fails with authentication error, THEN THE Image_Service SHALL retry the request using Hugging_Face_Provider
3. WHEN Provider_Fallback occurs, THE Image_Service SHALL log the fallback event for debugging
4. THE Image_Service SHALL complete the image generation request using the fallback provider without user intervention
5. WHEN both providers are configured, THE Image_Service SHALL use the user-selected provider without fallback unless an error occurs

### Requirement 4: Free Tier Compatibility

**User Story:** As a user, I want to use Hugging Face's free tier for image generation, so that I can generate images without payment or credit card.

#### Acceptance Criteria

1. THE Hugging_Face_Provider SHALL authenticate using only an API_Token without payment information
2. THE Image_Gen_Function SHALL not require GPU resources or local model installation for Hugging Face models
3. THE Image_Gen_Function SHALL handle Free_Tier rate limits gracefully with descriptive error messages
4. WHEN Free_Tier rate limit is exceeded, THE Image_Gen_Function SHALL return an error indicating rate limit and retry time
5. THE Image_Service SHALL not cache or store Hugging Face API credentials beyond the request lifecycle

### Requirement 5: Image Display Integration

**User Story:** As a user, I want generated images from Hugging Face to display in chat like DALL-E images, so that I have a consistent experience regardless of provider.

#### Acceptance Criteria

1. WHEN Hugging Face generates an image, THE Image_Result_Component SHALL display it using the same rendering logic as OpenAI images
2. THE Image_Result_Component SHALL support both URL-based and base64-encoded image data from Hugging Face
3. THE Image_Result_Component SHALL display provider and model information in the image metadata section
4. THE Image_Result_Component SHALL maintain responsive layout and hover effects for Hugging Face images
5. WHEN image loading fails, THE Image_Result_Component SHALL display an error state with retry option

### Requirement 6: User Model Selection Interface

**User Story:** As a user, I want to select my preferred image generation model in the UI, so that I can control which provider and model generates my images.

#### Acceptance Criteria

1. THE Model_Selection SHALL include a dedicated section for image generation models
2. THE Model_Selection SHALL display model name, provider, and free tier indicator for each image model
3. WHEN a user selects an image model, THE Model_Selection SHALL persist the selection for subsequent image generation requests
4. THE Model_Selection SHALL visually distinguish between OpenAI and Hugging Face models
5. WHEN no OpenAI API_Token is configured, THE Model_Selection SHALL only display Hugging Face models as available options
6. THE Model_Selection SHALL display the currently selected image model in the chat interface

### Requirement 7: Intent Classification Compatibility

**User Story:** As a developer, I want the intent classifier to work seamlessly with multiple image providers, so that image generation requests route correctly regardless of provider.

#### Acceptance Criteria

1. WHEN Intent_Classifier detects image_gen intent, THE Intent_Classifier SHALL extract the image prompt regardless of provider
2. THE Intent_Classifier SHALL not modify its classification logic based on which provider is configured
3. THE Image_Service SHALL receive the classified intent and route to the appropriate provider based on user selection
4. WHEN a user explicitly mentions a model name in their prompt, THE Intent_Classifier SHALL preserve the model preference in parameters
5. THE Intent_Classifier SHALL maintain backward compatibility with existing DALL-E image generation requests

### Requirement 8: Configuration and Environment Variables

**User Story:** As a developer, I want to configure Hugging Face API credentials via environment variables, so that I can securely manage API access without hardcoding tokens.

#### Acceptance Criteria

1. THE Image_Gen_Function SHALL read Hugging Face API_Token from HUGGINGFACE_API_KEY environment variable
2. THE Image_Gen_Function SHALL read OpenAI API_Token from OPENAI_API_KEY environment variable
3. WHEN HUGGINGFACE_API_KEY is not set, THE Image_Gen_Function SHALL return an error for Hugging Face provider requests
4. WHEN OPENAI_API_KEY is not set, THE Image_Gen_Function SHALL return an error for OpenAI provider requests
5. THE system SHALL document required environment variables in .env.example file
6. THE Image_Gen_Function SHALL validate API_Token format before making external API requests

### Requirement 9: Error Handling and User Feedback

**User Story:** As a user, I want clear error messages when image generation fails, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN API_Token is missing, THE Image_Service SHALL display an error message indicating which provider requires configuration
2. WHEN API rate limit is exceeded, THE Image_Service SHALL display the rate limit error with estimated wait time
3. WHEN image generation times out, THE Image_Service SHALL display a timeout error with retry option
4. WHEN provider returns invalid response, THE Image_Service SHALL display a generic error message without exposing API details
5. THE Image_Service SHALL log detailed error information to browser console for debugging
6. WHEN Provider_Fallback occurs due to error, THE Image_Service SHALL notify the user which provider was used

### Requirement 10: API Request Format and Response Handling

**User Story:** As a developer, I want standardized API request and response handling, so that adding new models or providers is straightforward.

#### Acceptance Criteria

1. THE Image_Gen_Function SHALL format Hugging Face API requests according to Hugging Face Inference API specification
2. THE Image_Gen_Function SHALL format OpenAI API requests according to OpenAI Images API specification
3. WHEN Hugging Face returns image data as blob, THE Image_Gen_Function SHALL convert it to base64 or URL format
4. WHEN OpenAI returns image URL, THE Image_Gen_Function SHALL return the URL directly
5. THE Image_Gen_Function SHALL include request timeout of 60 seconds for all image generation requests
6. THE Image_Gen_Function SHALL set appropriate Content-Type headers for each provider's API requirements
7. THE Image_Service SHALL normalize responses from different providers into a consistent format for the Image_Result_Component
