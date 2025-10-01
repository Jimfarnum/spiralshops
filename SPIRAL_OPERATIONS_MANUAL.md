# SPIRAL Platform Operations Manual
**Comprehensive Guide for Site Management and Operations**

## Table of Contents
1. [Daily Operations](#daily-operations)
2. [User Management](#user-management)
3. [Retailer Onboarding](#retailer-onboarding)
4. [Content Management](#content-management)
5. [System Monitoring](#system-monitoring)
6. [Troubleshooting](#troubleshooting)
7. [AI Systems Management](#ai-systems-management)
8. [Emergency Procedures](#emergency-procedures)

## Daily Operations

### Morning Startup Checklist
1. **Platform Health Check**
   - Visit `/admin-test-dashboard` for system overview
   - Verify all 7 AI agents are operational
   - Check database connection status
   - Confirm payment processing functionality

2. **Performance Monitoring**
   - Review overnight logs in SPIRAL admin dashboard
   - Check response times for key APIs
   - Monitor user activity metrics
   - Verify geographic search functionality

3. **Content Updates**
   - Review pending retailer applications at `/admin-retailer-applications`
   - Update featured products and promotions
   - Check for new mall events and announcements
   - Verify inventory synchronization

### Key Administrative URLs
```
Admin Dashboard: /spiral-admin-dashboard
System Health: /admin-test-dashboard  
Retailer Management: /admin-retailer-applications
User Analytics: /ai-business-intelligence
Platform Testing: /spiral-100-compatibility-test
Live Monitoring: /api/check
```

## User Management

### Shopper Account Management
1. **Account Creation**: Users sign up via homepage or direct registration
2. **Profile Management**: Access via user settings for address, preferences
3. **Loyalty Points**: SPIRALs earned 1:1 on purchases, 2:1 redemption in stores
4. **Wishlist System**: AI-powered alerts for price drops and availability
5. **Order History**: Complete transaction tracking with shipping updates

### Retailer Account Management
1. **AI-Powered Onboarding**: 5-step conversational signup at `/ai-retailer-signup`
2. **Application Review**: Admin approval via `/admin-retailer-applications`
3. **Store Verification**: 5-tier verification system for trust building
4. **Inventory Management**: Complete dashboard with CSV import/export
5. **Performance Analytics**: Sales metrics and customer insights

## Retailer Onboarding

### AI-Assisted Signup Process
1. **Step 1: Business Information**
   - Company name, address, contact details
   - Business license verification
   - Tax ID and legal documentation

2. **Step 2: Store Categories**
   - Primary business category selection
   - Secondary categories and specializations
   - Service area and delivery options

3. **Step 3: Payment Setup**
   - Stripe Connect account creation
   - Bank account verification
   - Fee structure agreement

4. **Step 4: Inventory Setup**
   - Product catalog creation
   - Pricing and availability
   - Shipping and handling policies

5. **Step 5: Store Launch**
   - Final verification and approval
   - Store page publication
   - Marketing materials generation

### Manual Verification Process
- **Level 1**: Basic business verification
- **Level 2**: Enhanced documentation review
- **Level 3**: Local business verification
- **Level 4**: Premium trusted status
- **Level 5**: Verified local institution

## Content Management

### Product Catalog Management
1. **Category Structure**: 18 major categories with 144+ subcategories
2. **Product Entry**: AI-assisted with intelligent categorization
3. **Inventory Sync**: Real-time updates with retailer systems
4. **Image Management**: Cloud storage with automatic optimization
5. **SEO Optimization**: Automated meta tags and descriptions

### Mall Events and Promotions
1. **Event Creation**: Admin interface for mall-wide events
2. **Promotion Management**: Store-specific and platform-wide deals
3. **Notification System**: Email, SMS, and push notifications
4. **RSVP Tracking**: Event attendance and engagement metrics
5. **Reward Integration**: Bonus SPIRALs for event participation

### Geographic Data Management
1. **Store Locations**: GPS coordinates and address verification
2. **Service Areas**: Delivery zones and pickup locations
3. **Distance Calculations**: Real-time mileage using Haversine formula
4. **SPIRAL Centers**: Hub locations for consolidated shipping
5. **Route Optimization**: Efficient delivery path planning

## System Monitoring

### Real-Time Monitoring Dashboard
- **API Response Times**: All endpoints monitored
- **Database Performance**: Query optimization and connection pooling
- **AI Agent Status**: 7-agent system health monitoring
- **Payment Processing**: Transaction success rates
- **User Activity**: Real-time engagement metrics

### Key Performance Indicators
1. **Platform Uptime**: Target 99.9% availability
2. **Page Load Times**: <2 seconds for all pages
3. **API Response**: <500ms for standard requests
4. **Search Accuracy**: AI-powered results relevance
5. **User Satisfaction**: Review scores and feedback

### Automated Alerts
- **System Downtime**: Immediate notification
- **High Error Rates**: API failure thresholds
- **Payment Issues**: Transaction processing problems
- **Security Threats**: Suspicious activity detection
- **Capacity Limits**: Resource utilization warnings

## Troubleshooting

### Common Issues and Solutions

**1. Slow Page Loading**
- Clear browser cache and cookies
- Check internet connection speed
- Verify CDN performance
- Review database query optimization

**2. Payment Processing Errors**
- Verify Stripe Connect configuration
- Check merchant account status
- Review transaction logs
- Test with different payment methods

**3. Search Results Issues**
- Clear search index cache
- Verify GPS permissions
- Check location service accuracy
- Review search algorithm parameters

**4. Mobile Compatibility**
- Test responsive design breakpoints
- Verify touch target sizes (44px minimum)
- Check mobile-specific features
- Review app-like functionality

**5. AI Agent Malfunctions**
- Restart individual agent systems
- Check OpenAI API status and quotas
- Verify conversation flow logic
- Review training data quality

### Emergency Restart Procedures
1. **Workflow Restart**: Use Replit workflow restart for quick fixes
2. **Database Connection Reset**: Refresh connection pool
3. **Cache Clearing**: Redis cache invalidation
4. **Service Restart**: Individual microservice restart
5. **Full Platform Reset**: Complete system reboot (last resort)

## AI Systems Management

### AI Agent Coordination
1. **ShopperAssistAgent**: Customer service and guidance
2. **WishlistAgent**: Price monitoring and alerts
3. **ImageSearchAgent**: Visual product discovery
4. **MallDirectoryAgent**: Store and location assistance
5. **AdminAuditAgent**: System performance monitoring
6. **RetailerOnboardAgent**: Business signup assistance
7. **ProductEntryAgent**: Inventory management support

### AI Performance Optimization
- **Response Time**: Target <2 seconds for AI interactions
- **Accuracy Monitoring**: Conversation success rates
- **Learning Updates**: Regular model fine-tuning
- **Fallback Systems**: Human handoff when needed
- **Usage Analytics**: AI interaction patterns and effectiveness

### AI Training and Updates
1. **Conversation Logs**: Review for improvement opportunities
2. **User Feedback**: Incorporate rating and comments
3. **Edge Cases**: Handle unusual scenarios
4. **Model Updates**: Deploy improved AI versions
5. **Testing Protocol**: Validate changes before production

## Emergency Procedures

### Critical System Failure
1. **Immediate Assessment**: Determine scope and impact
2. **User Communication**: Status page and notifications
3. **Backup Activation**: Switch to redundant systems
4. **Issue Resolution**: Root cause analysis and fix
5. **Recovery Verification**: Full system testing
6. **Post-Incident Review**: Process improvement

### Data Breach Response
1. **Immediate Containment**: Isolate affected systems
2. **Impact Assessment**: Determine data exposure
3. **User Notification**: Legal compliance requirements
4. **Security Patching**: Fix vulnerabilities
5. **Monitoring Enhancement**: Prevent future incidents
6. **Compliance Reporting**: Regulatory requirements

### Payment System Issues
1. **Transaction Halt**: Stop processing if needed
2. **Merchant Notification**: Alert affected retailers
3. **Customer Communication**: Explain any delays
4. **Alternative Methods**: Backup payment options
5. **System Restoration**: Resume normal operations
6. **Reconciliation**: Verify all transactions

### Contact Information
- **Technical Support**: Available 24/7 via platform messaging
- **Emergency Hotline**: Critical issues escalation
- **Legal Compliance**: Data protection and regulatory issues
- **Business Operations**: Retailer and customer concerns

---
**Operations Manual Version**: 1.0  
**Last Updated**: August 7, 2025  
**Next Review**: Monthly or as needed