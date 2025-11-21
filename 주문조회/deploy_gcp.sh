#!/bin/bash

# Configuration
PROJECT_ID="YOUR_GCP_PROJECT_ID" # Replace with your GCP Project ID
REGION="asia-northeast3" # Seoul region
SERVICE_NAME="order-sync-job"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# 1. Build and Push Docker Image
echo "Building and pushing Docker image..."
gcloud builds submit --tag "$IMAGE_NAME" .

# 2. Create/Update Cloud Run Job
echo "Deploying Cloud Run Job..."
# Note: You need to set SHEET_ID and GOOGLE_CREDENTIALS_JSON env vars.
# We'll assume they are set in the current shell or you will set them in the console.
# Here we just create the job definition.

gcloud run jobs deploy "$SERVICE_NAME" \
    --image "$IMAGE_NAME" \
    --region "$REGION" \
    --tasks 1 \
    --max-retries 0 \
    --set-env-vars "SHEET_ID=${SHEET_ID}" \
    --set-env-vars "GOOGLE_CREDENTIALS_JSON=${GOOGLE_CREDENTIALS_JSON}"

# 3. Create Cloud Scheduler (Optional, run manually if needed)
# echo "Creating Cloud Scheduler..."
# gcloud scheduler jobs create http "$SERVICE_NAME-scheduler" \
#     --schedule="* * * * *" \
#     --uri="https://$REGION-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/$PROJECT_ID/jobs/$SERVICE_NAME:run" \
#     --http-method POST \
#     --oauth-service-account-email "YOUR_SERVICE_ACCOUNT_EMAIL"

echo "Deployment complete! Go to Cloud Console to configure the Scheduler and Secrets if needed."
