#!/bin/bash

# SPIRAL Internal Deployment Script
# Quick deployment runner

echo "🚀 SPIRAL Internal Deployment System"
echo "=================================="

case "${1:-help}" in
  "start"|"deploy")
    echo "Starting internal deployment..."
    node deploy-internal.js
    ;;
  "api")
    echo "Starting deployment API server..."
    node deploy-api.js
    ;;
  "status")
    echo "Checking deployment status..."
    if command -v jq > /dev/null; then
      curl -s http://localhost:3001/deploy/status | jq .
    else
      curl -s http://localhost:3001/deploy/status
    fi
    ;;
  "stop")
    echo "Stopping deployment..."
    pkill -f "deploy-api.js" || echo "No API server running"
    pkill -f "node.*dist/index.js" || echo "No production server running"
    ;;
  "logs")
    echo "Viewing deployment logs..."
    if [ -f "./deployment.log" ]; then
      tail -50 ./deployment.log
    else
      echo "No deployment logs found"
    fi
    ;;
  *)
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start    - Run internal deployment"
    echo "  api      - Start deployment API server"
    echo "  status   - Check deployment status"
    echo "  stop     - Stop all deployment processes"
    echo "  logs     - View recent deployment logs"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh start     # Deploy application"
    echo "  ./deploy.sh status    # Check status"
    ;;
esac