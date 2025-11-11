# Swagger API Documentation Setup

## Dynamic Server Configuration

The Swagger API documentation automatically configures available servers based on your environment variables.

## How It Works

### Local Development
When running locally with default settings:
```bash
APP_URL=http://localhost:3000  # or not set
```

**Swagger shows:**
- 🖥️ `http://localhost:3000` - Local Development Server

### Production Deployment
When deployed with production URL set:
```bash
APP_URL=https://your-app.up.railway.app
NODE_ENV=production
```

**Swagger shows:**
- 🖥️ `http://localhost:3000` - Local Development Server
- 🌐 `https://your-app.up.railway.app` - Production Server (Railway)

## Setup Instructions

### For Railway Deployment

1. **Get Your Railway URL**
   - Go to your Railway project
   - Click on your service
   - Navigate to **Settings** tab
   - Under **Domains**, copy your Railway-generated URL
   - Example: `https://nu-sims-ppob-production.up.railway.app`

2. **Set Environment Variable**
   - In Railway dashboard, go to your service
   - Click **Variables** tab
   - Add new variable:
     ```
     Key: APP_URL
     Value: https://your-app-name.up.railway.app
     ```

3. **Redeploy (if needed)**
   - Railway will automatically redeploy on variable change
   - Or manually trigger redeploy from Deployments tab

4. **Verify in Swagger**
   - Visit: `https://your-app.up.railway.app/api-docs`
   - You should see both servers in the dropdown
   - Select production server to test against live environment

## Server Dropdown Usage

In Swagger UI, you'll see a **Servers** dropdown at the top:

```
Servers
[v] https://your-app.up.railway.app - Production Server (Railway)
    http://localhost:3000 - Local Development Server
```

### Switching Servers

1. Click the **Servers** dropdown
2. Select desired server:
   - **Local** - For testing against your local development server
   - **Production** - For testing against live Railway deployment
3. All API requests will now target the selected server

## Configuration Details

The server configuration is handled in `config/swagger.js`:

```javascript
// Dynamic server detection
const appUrl = process.env.APP_URL || 'http://localhost:3000';
const nodeEnv = process.env.NODE_ENV || 'development';

// Always include localhost for testing
servers.push({
  url: 'http://localhost:3000',
  description: 'Local Development Server'
});

// Add production server if APP_URL is set and different from localhost
if (appUrl !== 'http://localhost:3000') {
  servers.push({
    url: appUrl,
    description: nodeEnv === 'production' 
      ? 'Production Server (Railway)' 
      : 'Staging Server'
  });
}
```

## Benefits

✅ **Single Configuration** - Set once in environment variables  
✅ **Auto-Detection** - Swagger automatically picks up the production URL  
✅ **Easy Testing** - Switch between environments with one click  
✅ **No Code Changes** - Works across deployments without modification  
✅ **Clear Labels** - Server descriptions indicate environment type  

## Troubleshooting

### Problem: Production server not showing in Swagger

**Possible causes:**
1. `APP_URL` not set in Railway environment variables
2. `APP_URL` set to `http://localhost:3000` (same as default)
3. App needs redeployment after variable change

**Solution:**
```bash
# Verify in Railway:
1. Check Variables tab
2. Ensure APP_URL is set to your Railway URL
3. Redeploy the application
4. Clear browser cache and reload Swagger UI
```

### Problem: Wrong URL in production server

**Solution:**
```bash
# Update APP_URL in Railway:
1. Variables tab → Edit APP_URL
2. Set to correct Railway URL (include https://)
3. Save changes
4. Wait for auto-redeploy
```

### Problem: Both servers showing localhost

**Solution:**
```bash
# APP_URL must be different from localhost:
❌ APP_URL=http://localhost:3000
❌ APP_URL=http://127.0.0.1:3000
✅ APP_URL=https://your-app.up.railway.app
```

## Example URLs

### Railway Generated URLs
```
https://nu-sims-ppob-production.up.railway.app
https://nu-sims-ppob-staging-abc123.up.railway.app
```

### Custom Domain (if configured)
```
https://api.yourdomain.com
```

### Testing
```bash
# Get Swagger JSON
curl https://your-app.up.railway.app/api-docs/swagger.json

# Check servers section in response
# Should show both localhost and production URLs
```

## Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- [README.md](./README.md) - Main documentation
- [.env.example](./.env.example) - Environment variables reference

## Notes

- The localhost server is always shown for developer convenience
- Production server only appears when `APP_URL` is properly configured
- Server selection persists during your Swagger UI session
- Each request shows which server it's targeting in the curl example

---

**Last Updated:** November 2025  
**Applies to:** SIMS PPOB API v1.0.0
