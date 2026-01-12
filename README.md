# n8n-nodes-planetscale

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for PlanetScale, the serverless MySQL-compatible database platform built on Vitess. This node enables workflow automation for database management, branch operations, deploy requests, and connection credential management through PlanetScale's REST API.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![PlanetScale](https://img.shields.io/badge/PlanetScale-API-black)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **12 Resource Categories**: Organizations, Databases, Branches, Deploy Requests, Passwords, Backups, Deploy Queue, Service Tokens, Webhooks, Organization Members, Regions, Users
- **60+ Operations**: Full CRUD operations across all resources
- **Dual Authentication**: Support for Service Token and OAuth authentication
- **Trigger Node**: Real-time webhook events for branches and deploy requests
- **Cursor-based Pagination**: Efficient handling of large datasets
- **Rate Limit Handling**: Built-in 600 req/min rate limit management
- **Signature Verification**: HMAC-SHA256 webhook signature verification

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-planetscale` in the input field
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-planetscale
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-planetscale.git
cd n8n-nodes-planetscale

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-planetscale

# Restart n8n
n8n start
```

## Credentials Setup

### Service Token Authentication

| Parameter | Type | Description |
|-----------|------|-------------|
| Service Token ID | String | Your PlanetScale service token ID |
| Service Token | String | Your PlanetScale service token secret |

**To create a service token:**

1. Log into PlanetScale Dashboard
2. Navigate to **Organization Settings** > **Service tokens**
3. Click **"New service token"**
4. Name the token and click **"Create service token"**
5. Copy the `SERVICE_TOKEN_ID` and `SERVICE_TOKEN` (shown only once)
6. Grant appropriate permissions (read_branch, create_branch, etc.)

### OAuth Authentication

| Parameter | Type | Description |
|-----------|------|-------------|
| Access Token | String | OAuth access token from authorization flow |

**To use OAuth:**

1. Create an OAuth application in **Organization Settings** > **Beta features**
2. Implement the OAuth 2.0 authorization code flow
3. Use the resulting access token

## Resources & Operations

### Organizations

| Operation | Description |
|-----------|-------------|
| Get | Get organization details |
| Get Many | List all organizations |
| List Regions | List available regions for an organization |
| List Audit Logs | List audit logs for an organization |

### Databases

| Operation | Description |
|-----------|-------------|
| Create | Create a new database |
| Get | Get database details |
| Get Many | List all databases in an organization |
| Update | Update database settings |
| Delete | Delete a database |
| List Regions | List regions where database is deployed |

### Branches

| Operation | Description |
|-----------|-------------|
| Create | Create a new branch from a parent |
| Get | Get branch details |
| Get Many | List all branches for a database |
| Delete | Delete a branch |
| Promote | Promote branch to production |
| Demote | Demote production branch to development |
| Enable Safe Migrations | Enable safe migrations on branch |
| Disable Safe Migrations | Disable safe migrations on branch |
| Get Schema | Get branch schema |
| Lint Schema | Lint branch schema |
| Get Diff | Get schema diff between branches |

### Deploy Requests

| Operation | Description |
|-----------|-------------|
| Create | Create a new deploy request |
| Get | Get deploy request details |
| Get Many | List deploy requests for a database |
| Update | Update deploy request |
| Close | Close/cancel a deploy request |
| Deploy | Execute the deploy request |
| Queue | Add deploy request to queue |
| Get Deploy Operations | List operations for a deploy |
| Skip Revert Period | Skip the revert period |
| Get Deployment Diff | Get the schema diff for the deploy |

### Passwords (Connection Credentials)

| Operation | Description |
|-----------|-------------|
| Create | Create a new password/connection credential |
| Get | Get password details |
| Get Many | List passwords for a branch |
| Delete | Delete a password |
| Renew | Renew an expiring password |

### Backups

| Operation | Description |
|-----------|-------------|
| Create | Create a new backup |
| Get | Get backup details |
| Get Many | List backups for a branch |
| Delete | Delete a backup |
| Restore | Restore from backup to a new branch |

### Deploy Queue

| Operation | Description |
|-----------|-------------|
| Get | Get the current deploy queue status |
| List | List items in the deploy queue |

### Service Tokens

| Operation | Description |
|-----------|-------------|
| Create | Create a new service token |
| Get | Get service token details |
| Get Many | List service tokens for an organization |
| Delete | Delete a service token |
| List Accesses | List access permissions for a token |
| Add Access | Add access permission to a token |
| Delete Access | Remove access permission from a token |

### Webhooks

| Operation | Description |
|-----------|-------------|
| Create | Create a new webhook |
| Get | Get webhook details |
| Get Many | List webhooks for a database |
| Update | Update webhook configuration |
| Delete | Delete a webhook |
| Test | Send a test webhook |

### Organization Members

| Operation | Description |
|-----------|-------------|
| Invite | Invite a new member |
| Get | Get member details |
| Get Many | List members of an organization |
| Update | Update member role |
| Remove | Remove member from organization |

### Regions

| Operation | Description |
|-----------|-------------|
| Get | Get region details |
| Get Many | List all available regions |

### Users

| Operation | Description |
|-----------|-------------|
| Get Current | Get current authenticated user details |

## Trigger Node

The **PlanetScale Trigger** node enables real-time workflow automation by receiving webhook events from PlanetScale.

### Supported Events

| Event | Description |
|-------|-------------|
| branch.created | New branch created |
| branch.deleted | Branch deleted |
| branch.ready | Branch provisioning complete |
| branch.sleeping | Branch entered sleep state |
| deploy_request.opened | Deploy request opened |
| deploy_request.queued | Deploy request added to queue |
| deploy_request.in_progress | Deploy request execution started |
| deploy_request.schema_applied | Schema changes applied |
| deploy_request.completed | Deploy request completed successfully |
| deploy_request.errored | Deploy request failed |
| deploy_request.closed | Deploy request closed/cancelled |

### Configuration

| Parameter | Required | Description |
|-----------|----------|-------------|
| Organization Name | Yes | The PlanetScale organization slug |
| Database Name | Yes | The database to receive events from |
| Events | Yes | Events to listen for |
| Webhook Secret | No | Secret for signature verification (auto-generated if empty) |

### Webhook Signature Verification

The trigger node verifies webhook signatures using HMAC-SHA256 to ensure authenticity. This is enabled by default and uses the `x-planetscale-signature` header.

## Usage Examples

### Create a Branch and Deploy Request

```javascript
// Step 1: Create a feature branch
{
  "resource": "branch",
  "operation": "create",
  "organizationName": "my-org",
  "databaseName": "my-database",
  "name": "feature-add-users-table",
  "parentBranch": "main"
}

// Step 2: Create a deploy request
{
  "resource": "deployRequest",
  "operation": "create",
  "organizationName": "my-org",
  "databaseName": "my-database",
  "branch": "feature-add-users-table",
  "intoBranch": "main"
}
```

### Create Connection Credentials

```javascript
{
  "resource": "password",
  "operation": "create",
  "organizationName": "my-org",
  "databaseName": "my-database",
  "branchName": "main",
  "name": "production-app",
  "role": "readwriter"
}
```

### Get Schema Diff

```javascript
{
  "resource": "branch",
  "operation": "getDiff",
  "organizationName": "my-org",
  "databaseName": "my-database",
  "branchName": "feature-branch",
  "compareBranch": "main"
}
```

## PlanetScale Concepts

### Branches

PlanetScale databases use a Git-like branching model. Each branch is an isolated copy of your database schema that can be modified independently.

- **Production branches**: Protected branches that receive production traffic
- **Development branches**: Used for schema development and testing
- **Safe migrations**: Automatic schema migration safeguards

### Deploy Requests

Deploy requests are similar to pull requests. They allow you to:

1. View schema differences between branches
2. Request reviews from team members
3. Deploy schema changes to production safely
4. Automatically rollback if issues occur

### Connection Credentials (Passwords)

PlanetScale generates unique connection credentials for each branch. Credentials can have different roles:

- **Admin**: Full database access
- **Reader**: Read-only access
- **Writer**: Write-only access
- **ReadWriter**: Read and write access

## Error Handling

The node handles the following error scenarios:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |

All operations support the **Continue on Fail** option to handle errors gracefully in workflows.

## Rate Limiting

PlanetScale API enforces a rate limit of **600 requests per minute** per authentication token. The node automatically handles rate limit errors with descriptive messages.

For webhook test endpoints, there's an additional limit of **1 request per 20 seconds** per webhook.

## Security Best Practices

1. **Use Service Tokens with Minimal Permissions**: Only grant the permissions your workflow needs
2. **Rotate Credentials Regularly**: Periodically regenerate service tokens
3. **Enable Webhook Signature Verification**: Always verify webhook signatures in production
4. **Use Separate Tokens per Environment**: Don't share tokens between development and production
5. **Protect Connection Strings**: Never expose database passwords in logs or outputs

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. All changes pass linting (`npm run lint`)
2. All tests pass (`npm test`)
3. New features include appropriate tests
4. Documentation is updated as needed

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-planetscale/issues)
- **Documentation**: [PlanetScale API Docs](https://api-docs.planetscale.com/)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [PlanetScale](https://planetscale.com/) for their excellent serverless database platform
- [n8n](https://n8n.io/) for the powerful workflow automation platform
- [Vitess](https://vitess.io/) for the underlying database technology
