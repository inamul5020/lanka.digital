# 🏗️ Lanka.Digital Technical Architecture

## Current Architecture (Frontend-Only)

### Frontend Stack
```
React 18 + TypeScript + Vite
├── Tailwind CSS (Styling)
├── Lucide React (Icons)
├── Supabase JS Client (Future backend integration)
└── Custom Components (Navigation, Modals, Pages)
```

### Current State
- ✅ **Fully Functional Frontend**: Complete UI with hardcoded data
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Component Architecture**: Modular, reusable components
- ✅ **Mock Data**: Realistic sample data for all features
- ✅ **Development Ready**: Hot reload, TypeScript checking, ESLint

### Pages & Features
- **HomePage**: Hero, statistics, trending products, forum highlights
- **ForumPage**: Category navigation, thread listings, search/filtering
- **StorePage**: Product catalog with grid/list views
- **ProductDetailPage**: Comprehensive product view with tabs
- **LeaderboardPage**: User rankings and gamification display
- **ProfilePage**: User profiles, achievements, activity
- **ThreadDetailPage**: Forum thread discussions

---

## Target Architecture (Full-Stack)

### Backend Stack
```
Self-Hosted Supabase
├── PostgreSQL Database
├── Supabase Auth (Authentication)
├── Supabase Storage (File uploads)
├── Supabase Realtime (Live updates)
└── Row Level Security (Data access control)
```

### API Architecture
```
RESTful API Endpoints
├── Authentication (/auth/*)
├── Users (/users/*)
├── Products (/products/*)
├── Threads (/threads/*)
├── Downloads (/downloads/*)
├── Payments (/payments/*)
└── Admin (/admin/*)
```

### Infrastructure
```
Docker + VPS Hosting
├── Supabase (Database + Auth + Storage)
├── Application Server (Node.js/Express)
├── Reverse Proxy (Nginx/Caddy)
├── SSL Certificates (Let's Encrypt)
└── CDN (Cloudflare/CloudFront)
```

---

## Database Schema Design

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Newbie',
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  price DECIMAL(10,2),
  is_premium BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  file_url TEXT, -- Supabase Storage reference
  author_id UUID REFERENCES users(id),
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### threads
```sql
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES users(id) NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### replies
```sql
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### downloads
```sql
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  downloaded_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);
```

#### purchases
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'LKR',
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes & Performance
```sql
-- Performance indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_author ON products(author_id);
CREATE INDEX idx_threads_category ON threads(category);
CREATE INDEX idx_threads_author ON threads(author_id);
CREATE INDEX idx_replies_thread ON replies(thread_id);
CREATE INDEX idx_downloads_user ON downloads(user_id);
CREATE INDEX idx_purchases_user ON purchases(user_id);

-- Full-text search indexes
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_threads_search ON threads USING gin(to_tsvector('english', title || ' ' || content));
```

---

## Authentication & Authorization

### Authentication Flow
```
Client Request → Supabase Auth → JWT Token → API Access
     ↓
Session Management → Protected Routes → Role-Based Access
```

### User Roles & Permissions
- **Guest**: Browse public content, limited downloads
- **Registered User**: Full access, daily unlocks, forum participation
- **Premium User**: Unlimited downloads, exclusive content, priority support
- **Admin**: Full system access, content management, user moderation

### Row Level Security (RLS) Policies
```sql
-- Products: Public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Users: Own profile read/write, admin full access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Threads: Public read, authenticated write
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
```

---

## File Storage Architecture

### Supabase Storage Buckets
```
lanka-digital-public/
├── product-thumbnails/     # Product preview images
├── user-avatars/          # User profile pictures
└── forum-attachments/     # Forum image attachments

lanka-digital-private/
├── product-files/         # Digital product downloads
├── premium-content/       # Exclusive premium files
└── user-uploads/          # Private user content
```

### Access Control
- **Public Bucket**: Read access for all authenticated users
- **Private Bucket**: Signed URLs with expiration
- **Admin Bucket**: Full access for content managers
- **CDN Integration**: Global content delivery for faster downloads

---

## API Design Patterns

### RESTful Endpoints Structure
```
/api/v1/
├── /auth/                 # Authentication endpoints
├── /users/                # User management
├── /products/             # Product catalog
├── /threads/              # Forum threads
├── /downloads/            # Download management
├── /payments/             # Payment processing
└── /admin/                # Administrative functions
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### Error Handling
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { ... }
  }
}
```

---

## Frontend-Backend Integration

### State Management
```
React Query (TanStack Query)
├── Server State Management
├── Caching & Synchronization
├── Optimistic Updates
└── Background Refetching
```

### API Client Architecture
```
Supabase JS Client
├── Authentication
├── Database Queries
├── File Storage
├── Realtime Subscriptions
└── RPC Functions
```

### Real-time Features
```
Supabase Realtime
├── Live Forum Updates
├── User Activity Indicators
├── Notification System
└── Live Chat (Future)
```

---

## Security Considerations

### Data Protection
- **Encryption**: Data at rest and in transit
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Policies**: Strong password requirements
- **Rate Limiting**: Brute force protection
- **Session Management**: Secure session handling

### File Security
- **File Type Validation**: Only allowed file types
- **Virus Scanning**: Malware detection
- **Access Control**: Signed URLs with expiration
- **Storage Encryption**: Encrypted file storage

---

## Performance Optimization

### Database Optimization
- **Query Optimization**: Efficient SQL queries
- **Indexing Strategy**: Strategic database indexes
- **Connection Pooling**: Efficient database connections
- **Caching Layer**: Redis for frequently accessed data

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed images and WebP format
- **Bundle Analysis**: Optimized bundle sizes
- **CDN Delivery**: Global content delivery

### API Optimization
- **Response Caching**: HTTP caching headers
- **Pagination**: Efficient data pagination
- **Batch Operations**: Bulk API operations
- **Rate Limiting**: Prevent API abuse

---

## Monitoring & Logging

### Application Monitoring
```
Application Metrics
├── Response Times
├── Error Rates
├── User Activity
├── System Resources
└── Database Performance
```

### Logging Strategy
```
Structured Logging
├── Application Logs
├── Database Logs
├── Security Events
├── User Actions
└── System Events
```

### Alerting System
```
Automated Alerts
├── System Downtime
├── High Error Rates
├── Security Incidents
├── Performance Issues
└── Resource Exhaustion
```

---

## Deployment Architecture

### Development Environment
```
Local Development
├── Docker Compose
├── Hot Reload
├── Local Database
└── Development Tools
```

### Production Environment
```
Docker Containerization
├── Application Container
├── Database Container
├── Reverse Proxy
├── SSL Termination
└── Load Balancing
```

### CI/CD Pipeline
```
GitHub Actions
├── Automated Testing
├── Code Quality Checks
├── Security Scanning
├── Build & Deploy
└── Rollback Capability
```

---

## Scaling Strategy

### Horizontal Scaling
- **Application Servers**: Multiple instances behind load balancer
- **Database**: Read replicas for high-traffic queries
- **File Storage**: Distributed storage with CDN
- **Caching**: Redis cluster for session and data caching

### Performance Monitoring
- **Real User Monitoring**: Frontend performance tracking
- **Synthetic Monitoring**: Automated performance tests
- **Database Monitoring**: Query performance and bottlenecks
- **Infrastructure Monitoring**: Server and network monitoring

---

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Daily automated backups
- **File Backups**: Regular file system backups
- **Configuration Backups**: Infrastructure as code backups
- **Offsite Storage**: Secure offsite backup storage

### Recovery Procedures
- **Database Recovery**: Point-in-time recovery capability
- **Application Recovery**: Automated deployment rollback
- **Data Integrity**: Regular data validation checks
- **Business Continuity**: Redundant infrastructure components

---

**Document Version**: 1.0.0
**Last Updated**: October 2025
**Architecture Status**: Planned Implementation
**Next Review**: After Phase 2 completion
