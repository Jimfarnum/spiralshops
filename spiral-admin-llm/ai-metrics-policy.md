# AI Team Performance Policy

## Standard Operating Procedures

### Performance Standards
- **Minimum TER**: Every agent must maintain TER ≥ 85 on rolling 7-day average
- **Red Flag Thresholds**: Any dimension (Cognition/Efficiency/Teamwork) < 80 triggers remediation
- **Escalation Triggers**: If an agent drops below thresholds, Clara must recruit backup and escalate

### Resource Budgets
- **Token Budget**: 8,000 tokens per agent per task
- **CPU Budget**: 500ms per task
- **Memory Budget**: 1,024MB per agent
- **Latency Target**: ≤600ms (ideal), 5,000ms (cutoff)

### Privacy & Safety
- **No Training on User Data**: Without explicit consent
- **Redaction Required**: PII must be removed from logs
- **Retention Windows**: User data purged per GDPR/CCPA requirements

### Team Coordination Rules
- **Handoff Quality**: Complete context must be passed between agents
- **No Redundancy**: Agents must check for existing work before duplicating efforts
- **Conflict Resolution**: Clara has final authority on conflicting agent outputs
- **Outcome Alignment**: All results must map to user goals (shopper/retailer/mall/vendor)

### Monitoring & Remediation
- **Real-time Monitoring**: TER scores updated continuously
- **Weekly Reviews**: Performance trends analyzed for all agents
- **Automatic Failover**: Backup agents activated for failing primary agents
- **Performance Improvement Plans**: Agents scoring <70 TER require immediate attention

### Operational Excellence Goals
- **PhD-Level Cognition**: Accurate, grounded, deeply reasoned responses
- **Navy SEAL Efficiency**: Fast, reliable, resource-disciplined execution
- **Elite Team Coordination**: Seamless handoffs, smart specialization, unified outcomes

*This policy ensures measurable, auditable proof that SPIRAL's AI team operates at the highest standards.*