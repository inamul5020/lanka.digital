# 🔧 Phase 1.1: Self-Hosted Supabase Setup Guide

**Lanka.Digital Backend Infrastructure Setup**

## 📋 Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended)
- **RAM**: 4GB minimum, 8GB recommended
- **CPU**: 2 cores minimum, 4 cores recommended
- **Storage**: 20GB free space
- **Network**: Stable internet connection

### Required Software
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: Latest version
- **curl/wget**: For downloading files

### Server Options
- **DigitalOcean Droplet**: $12/month (2GB RAM, 1 CPU)
- **Linode VPS**: $10/month (2GB RAM, 1 CPU)
- **AWS EC2 t3.micro**: ~$10/month (free tier eligible)
- **Local Development**: Docker Desktop

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Server Preparation

#### 1.1 Create VPS Instance
```bash
# Choose your provider and create instance with:
# - Ubuntu 22.04 LTS
# - 2GB RAM minimum
# - 25GB storage
# - SSH access
```

#### 1.2 Initial Server Setup
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git htop ufw

# Configure firewall (allow SSH, HTTP, HTTPS)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create non-root user
sudo adduser lanka
sudo usermod -aG sudo lanka
sudo su - lanka
```

### Step 2: Install Docker & Docker Compose

#### 2.1 Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
docker run hello-world
```

#### 2.2 Install Docker Compose
```bash
# Install Docker Compose v2
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 3: Install Supabase CLI

#### 3.1 Install Supabase CLI
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# OR using curl
curl -fsSL https://get.supabase.com | sh

# Verify installation
supabase --version
```

#### 3.2 Initialize Supabase Project
```bash
# Create project directory
mkdir lanka-digital-backend
cd lanka-digital-backend

# Initialize Supabase project
supabase init

# This creates:
# - config.toml (configuration)
# - docker-compose.yml (services)
# - migrations/ (database migrations)
# - seed.sql (initial data)
```

### Step 4: Configure Supabase

#### 4.1 Update Configuration
```toml
# Edit config.toml
nano config.toml

# Update with your settings:
[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
enabled = true
port = 54323
api_url = "http://127.0.0.1:54321"

# Add custom environment variables
[api.env]
SUPABASE_URL = "http://localhost:54321"
SUPABASE_ANON_KEY = "your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY = "your-service-key-here"
```

#### 4.2 Environment Variables Setup
```bash
# Create .env file
nano .env

# Add environment variables:
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-key-here

# Database connection
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# JWT secrets (generate secure random strings)
JWT_SECRET=your-super-secure-jwt-secret-here
ANON_KEY=your-anon-key-here
SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 5: Start Supabase Services

#### 5.1 Start All Services
```bash
# Start Supabase (this may take a few minutes first time)
supabase start

# Expected output:
# ✔ Started local development setup
# API URL: http://127.0.0.1:54321
# DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
# Studio URL: http://127.0.0.1:54323
# Inbucket URL: http://127.0.0.1:54324
```

#### 5.2 Verify Services
```bash
# Check running containers
docker ps

# Should see containers:
# - supabase-db (PostgreSQL)
# - supabase-kong (API Gateway)
# - supabase-realtime (WebSocket)
# - supabase-rest (REST API)
# - supabase-studio (Admin Panel)
# - supabase-auth (Authentication)
# - supabase-storage (File Storage)
```

### Step 6: Access Supabase Studio

#### 6.1 Open Admin Panel
```bash
# Supabase Studio should be available at:
# http://127.0.0.1:54323

# Or if running on server, access via SSH tunnel:
# ssh -L 54323:127.0.0.1:54323 user@your-server
# Then open: http://localhost:54323
```

#### 6.2 Initial Studio Setup
1. Open Supabase Studio in browser
2. Create admin account with email/password
3. Note down the API keys from Settings > API
4. Update your .env file with the keys

### Step 7: Database Setup

#### 7.1 Create Initial Schema
```sql
-- Connect to database
supabase db reset

-- Create Lanka.Digital database schema
-- (We'll create this in Phase 1.2)
```

#### 7.2 Test Database Connection
```bash
# Test connection
supabase db inspect

# Check database status
supabase status
```

### Step 8: Environment Setup

#### 8.1 Development Environment
```bash
# For local development
cp .env .env.development

# Update URLs for local development
SUPABASE_URL=http://localhost:54321
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

#### 8.2 Production Environment
```bash
# Create production config
cp config.toml config.prod.toml
cp .env .env.production

# Update production URLs
SUPABASE_URL=https://api.lanka.digital
DATABASE_URL=postgresql://user:password@prod-db-host:5432/lanka_prod
```

### Step 9: Security Configuration

#### 9.1 SSL/TLS Setup
```bash
# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d api.lanka.digital
```

#### 9.2 Firewall Configuration
```bash
# Configure UFW for Supabase ports
sudo ufw allow 54321/tcp  # API
sudo ufw allow 54323/tcp  # Studio
sudo ufw allow 54324/tcp  # Inbucket (email testing)

# Allow only necessary ports for production
sudo ufw --force reload
```

#### 9.3 Database Security
```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create database user for application
CREATE USER lanka_app WITH PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE postgres TO lanka_app;
```

### Step 10: Backup & Monitoring

#### 10.1 Setup Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
supabase db dump > backup_$DATE.sql
echo "Backup created: backup_$DATE.sql"
EOF

chmod +x backup.sh

# Schedule daily backups (optional)
# crontab -e
# 0 2 * * * /path/to/backup.sh
```

#### 10.2 Health Monitoring
```bash
# Check service health
curl http://localhost:54321/rest/v1/

# Monitor logs
supabase logs

# Check resource usage
docker stats
```

### Step 11: Testing Setup

#### 11.1 Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:54321/rest/v1/

# Test authentication
curl -X POST http://localhost:54321/auth/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@lanka.digital","password":"test123"}'
```

#### 11.2 Frontend Connection Test
```bash
# Update your frontend .env file
cd /path/to/lanka.digital
nano .env

# Add Supabase configuration:
VITE_SUPABASE_URL=http://your-server-ip:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🔧 Configuration Files

### Docker Compose Override (Optional)
```yaml
# Create docker-compose.override.yml for custom config
version: '3.8'
services:
  rest:
    environment:
      - MAX_ROWS=1000
      - MAX_REQUESTS_PER_MINUTE=1000

  auth:
    environment:
      - ENABLE_EMAIL_CONFIRM=true
      - ENABLE_PHONE_CONFIRM=false
```

### Nginx Reverse Proxy (Production)
```nginx
# /etc/nginx/sites-available/lanka-digital
server {
    listen 80;
    server_name api.lanka.digital;

    location / {
        proxy_pass http://127.0.0.1:54321;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: Port Already in Use
```bash
# Find process using port
sudo lsof -i :54321

# Kill process
sudo kill -9 <PID>

# Or change port in config.toml
port = 54325
```

#### Issue: Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again, or run:
newgrp docker
```

#### Issue: Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps | grep supabase-db

# Restart services
supabase stop
supabase start

# Reset database if needed
supabase db reset
```

#### Issue: SSL Certificate Issues
```bash
# Renew certificates
sudo certbot renew

# Test configuration
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 Verification Checklist

- [ ] Server created and accessible via SSH
- [ ] Docker and Docker Compose installed
- [ ] Supabase CLI installed and working
- [ ] Supabase project initialized
- [ ] Configuration files updated
- [ ] All services running (check `supabase status`)
- [ ] Supabase Studio accessible
- [ ] API endpoints responding
- [ ] Database connection working
- [ ] Environment variables configured
- [ ] SSL certificates installed (production)
- [ ] Firewall properly configured
- [ ] Backup script created
- [ ] Frontend can connect to Supabase

---

## 🚀 Next Steps

### After Phase 1.1 Completion:
1. **Phase 1.2**: Database schema design and implementation
2. **Phase 1.3**: File storage bucket configuration
3. **Phase 2.1**: Authentication system integration
4. **Frontend Integration**: Connect React app to Supabase

### Useful Commands:
```bash
# Start services
supabase start

# Stop services
supabase stop

# View logs
supabase logs

# Reset database
supabase db reset

# Check status
supabase status
```

---

## 📞 Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Self-Hosting Guide**: https://supabase.com/docs/guides/hosting/overview
- **CLI Reference**: https://supabase.com/docs/reference/cli
- **Community Forum**: https://github.com/supabase/supabase/discussions

---

**Status**: ✅ Ready for Implementation
**Estimated Time**: 4-6 hours
**Difficulty**: Intermediate
**Next Phase**: Database Schema Design
