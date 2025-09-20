# Apple Developer Account Setup for SPIRAL Mobile

## Quick Setup Guide

### Step 1: Apple Developer Account
1. **Visit**: https://developer.apple.com/programs/
2. **Enroll**: $99/year Apple Developer Program
3. **Choose**: Individual or Organization account
4. **Complete**: Identity verification process (2-3 business days)

### Step 2: App Store Connect Configuration
1. **Login**: https://appstoreconnect.apple.com
2. **Create App**:
   - Bundle ID: `com.spiral.mobile`
   - App Name: `SPIRAL Mobile`
   - Primary Language: English (US)
   - Category: Business → Productivity

### Step 3: Certificates & Provisioning
1. **In Xcode**:
   - Open `ios/SpiralMobile.xcworkspace`
   - Select SpiralMobile target
   - Go to Signing & Capabilities
   - Select your Team
   - Enable Automatic Signing

2. **Capabilities to Enable**:
   - Push Notifications
   - Background App Refresh
   - Background Processing

### Step 4: TestFlight Beta Setup
1. **Build Archive**:
   - Product → Archive in Xcode
   - Upload to App Store Connect
   - Wait for processing (10-30 minutes)

2. **TestFlight Configuration**:
   - Add Beta App Information
   - Upload App Review Information
   - Add Test Information
   - Submit for Beta App Review

3. **Invite Testers**:
   - Internal Testing: Up to 100 users (no review required)
   - External Testing: Up to 10,000 users (requires review)

### Step 5: App Store Submission
1. **App Information**:
   - Use metadata from `app-store-metadata.json`
   - Upload screenshots (required sizes included)
   - Add app description and keywords

2. **Pricing & Availability**:
   - Free app with subscription features
   - Available in all territories

3. **App Review**:
   - Submit for review
   - Response time: 7 days average
   - Address any feedback promptly

## Quick Launch Commands

```bash
# Install iOS dependencies
cd mobile
chmod +x ios/launch-testflight.sh
./ios/launch-testflight.sh

# Manual Xcode build
open ios/SpiralMobile.xcworkspace
# Then: Product → Archive → Upload to App Store Connect
```

## TestFlight Distribution Links

Once approved, you'll get:
- **Beta Link**: `https://testflight.apple.com/join/[BETA_CODE]`
- **QR Code**: For easy beta tester onboarding
- **Public Link**: After App Store approval

## App Store Review Guidelines Compliance

**SPIRAL Mobile meets Apple's requirements**:
- ✅ Business utility with clear value proposition
- ✅ Secure authentication and data handling
- ✅ No prohibited content or functionality
- ✅ Proper privacy policy and terms of service
- ✅ Professional UI following iOS design guidelines
- ✅ Stable performance with error handling

## Support Resources

- **Apple Developer Forums**: https://developer.apple.com/forums/
- **App Store Connect Help**: https://help.apple.com/app-store-connect/
- **TestFlight Beta Testing Guide**: https://help.apple.com/app-store-connect/#/dev2cd126805
- **App Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/

Your SPIRAL Mobile app is ready for the App Store ecosystem!