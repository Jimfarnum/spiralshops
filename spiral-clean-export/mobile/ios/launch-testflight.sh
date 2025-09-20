#!/bin/bash

# SPIRAL Mobile iOS TestFlight Launch Script
# Automates the complete iOS deployment process

set -e

echo "🚀 SPIRAL Mobile iOS TestFlight Launch"
echo "======================================"

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: iOS builds require macOS with Xcode"
    echo "Please run this script on a Mac with Xcode installed"
    exit 1
fi

# Check for Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode not found"
    echo "Please install Xcode from the Mac App Store"
    exit 1
fi

# Check for CocoaPods
if ! command -v pod &> /dev/null; then
    echo "📦 Installing CocoaPods..."
    sudo gem install cocoapods
fi

# Navigate to mobile directory
cd "$(dirname "$0")/.."

echo "📱 Setting up iOS dependencies..."
npx pod-install ios

# Install React Native CLI if needed
if ! command -v react-native &> /dev/null; then
    echo "⚛️ Installing React Native CLI..."
    npm install -g @react-native-community/cli
fi

echo "🔨 Building iOS project..."
npx react-native run-ios --mode Release

echo "📋 TestFlight Checklist:"
echo "========================"
echo "✅ iOS build configuration complete"
echo "✅ Dependencies installed"
echo "✅ Release build tested"
echo ""
echo "Next steps for TestFlight:"
echo "1. Open ios/SpiralMobile.xcworkspace in Xcode"
echo "2. Configure your Apple Developer Team in Signing & Capabilities"
echo "3. Archive the project (Product → Archive)"
echo "4. Upload to App Store Connect"
echo "5. Add to TestFlight and invite beta testers"
echo ""
echo "App Store Connect URL: https://appstoreconnect.apple.com"
echo "Bundle ID: com.spiral.mobile"
echo "App Name: SPIRAL Mobile"

echo "🎉 iOS build ready for TestFlight!"