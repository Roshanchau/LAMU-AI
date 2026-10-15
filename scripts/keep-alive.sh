#!/usr/bin/env bash
# ==============================================================================
# Keep Render Backend Warm (Free Tier Spin-Down Prevention)
# Pings https://lamu-ai.onrender.com/api/config every 10 minutes (600s).
# ==============================================================================

URL="${1:-https://lamu-ai.onrender.com/api/config}"
INTERVAL="${2:-600}"

echo "=========================================================="
echo " Starting LAMU-AI Render Keep-Alive Daemon"
echo " Target:   $URL"
echo " Interval: Every $INTERVAL seconds (~$((INTERVAL / 60)) min)"
echo " Press [Ctrl+C] to stop."
echo "=========================================================="

while true; do
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  RESPONSE=$(curl -s -o /dev/null -w "HTTP: %{http_code} | Time: %{time_total}s" --max-time 45 "$URL" 2>&1)
  echo "[$TIMESTAMP] Ping -> $RESPONSE"
  sleep "$INTERVAL"
done

