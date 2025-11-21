#!/bin/bash

# Configuration
# TODO: 1. 구글 스프레드시트 URL에서 '/d/' 와 '/edit' 사이의 긴 문자열을 복사해서 아래에 넣어주세요.
# If SHEET_ID is set in env (e.g. Docker/GitHub Actions), use it. Otherwise use the default.
SHEET_ID="${SHEET_ID:-YOUR_GOOGLE_SHEET_ID_HERE}"

# TODO: 2. 같은 폴더에 있는 'credentials.json' 파일에 다운로드 받은 키 내용을 붙여넣어주세요.
CREDENTIALS_PATH="./credentials.json"

# Handle credentials from environment variable (for Cloud/CI)
if [ ! -f "$CREDENTIALS_PATH" ] && [ -n "$GOOGLE_CREDENTIALS_JSON" ]; then
    echo "Creating credentials.json from environment variable..."
    echo "$GOOGLE_CREDENTIALS_JSON" > "$CREDENTIALS_PATH"
fi

# Project Directory (Adjust if needed)
# In Docker, we are already in the right directory or we set WORKDIR.
# We check if we are in a docker container or local.
if [ -f "/.dockerenv" ]; then
    PROJECT_DIR="."
else
    PROJECT_DIR="/Users/sanghunbruceham/Documents/GitHub/Platform/주문조회"
fi

# Calculate Today's Date
# We use today's date because we want to sync orders as they come in.
TODAY=$(date +%Y-%m-%d)

echo "[$(date)] Starting sync for date: $TODAY"

# Navigate to project directory
cd "$PROJECT_DIR" || { echo "Failed to cd to $PROJECT_DIR"; exit 1; }

# Execute PHP script
# We use the same date for --from and --to to capture the current day.
# The PHP script now handles deduplication automatically.
php orders_today.php \
    --from="$TODAY" \
    --to="$TODAY" \
    --sheet-id="$SHEET_ID" \
    --sheet-range="Orders!A1" \
    --google-credentials="$CREDENTIALS_PATH" \
    --format=json > /dev/null

# Check exit code
if [ $? -eq 0 ]; then
    echo "[$(date)] Export successful."
else
    echo "[$(date)] Export failed."
    exit 1
fi
