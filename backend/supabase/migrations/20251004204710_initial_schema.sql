-- Lanka.Digital Initial Database Schema
-- Phase 1.2: Database Schema Design

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- CATEGORIES TABLE
-- ===========================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('product', 'forum')),
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- USERS TABLE (extends Supabase auth.users)
-- ===========================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  location TEXT,

  -- Gamification fields
  points INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Newbie' CHECK (rank IN ('Newbie', 'Contributor', 'Expert', 'Elite Member', 'Moderator', 'Admin')),
  level INTEGER DEFAULT 1,

  -- Subscription/Premium
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMP WITH TIME ZONE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'enterprise')),

  -- Activity tracking
  total_uploads INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  total_posts INTEGER DEFAULT 0,
  total_replies INTEGER DEFAULT 0,
  helpful_votes_received INTEGER DEFAULT 0,

  -- Preferences
  email_notifications BOOLEAN DEFAULT true,
  download_notifications BOOLEAN DEFAULT true,
  forum_notifications BOOLEAN DEFAULT true,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  ban_until TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- PRODUCTS TABLE
-- ===========================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,

  -- Categorization
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',

  -- Pricing
  price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'LKR',
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Content
  thumbnail_url TEXT,
  preview_images TEXT[] DEFAULT '{}',
  file_url TEXT, -- Supabase Storage reference
  file_size_bytes BIGINT,
  file_type TEXT,

  -- Metadata
  author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  version TEXT DEFAULT '1.0.0',
  requirements TEXT,
  compatible_with TEXT[] DEFAULT '{}',

  -- Statistics
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- THREADS TABLE (Forum posts)
-- ===========================================
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,

  -- Categorization
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Author
  author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Thread properties
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Statistics
  views INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  total_votes INTEGER GENERATED ALWAYS AS (upvotes - downvotes) STORED,

  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- REPLIES TABLE (Forum thread replies)
-- ===========================================
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,

  -- Author
  author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Reply hierarchy (for nested replies)
  parent_reply_id UUID REFERENCES replies(id) ON DELETE CASCADE,
  depth INTEGER DEFAULT 0,

  -- Voting
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  total_votes INTEGER GENERATED ALWAYS AS (upvotes - downvotes) STORED,

  -- Moderation
  is_hidden BOOLEAN DEFAULT false,
  hidden_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- DOWNLOADS TABLE
-- ===========================================
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,

  -- Download details
  ip_address INET,
  user_agent TEXT,
  download_method TEXT DEFAULT 'web' CHECK (download_method IN ('web', 'api', 'premium')),

  -- Premium unlocks (for gamification)
  is_unlock BOOLEAN DEFAULT false,
  points_spent INTEGER DEFAULT 0,

  -- Timestamps
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, product_id) -- Prevent duplicate downloads
);

-- ===========================================
-- PURCHASES TABLE
-- ===========================================
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,

  -- Transaction details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'LKR',
  payment_method TEXT CHECK (payment_method IN ('card', 'paypal', 'bank_transfer', 'mobile')),
  transaction_id TEXT UNIQUE,
  payment_gateway TEXT, -- stripe, paypal, etc.

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),

  -- Additional data
  gateway_response JSONB,
  notes TEXT,

  -- Timestamps
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  UNIQUE(user_id, product_id, transaction_id) -- Prevent duplicate purchases
);

-- ===========================================
-- REVIEWS TABLE
-- ===========================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,

  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',

  -- Moderation
  is_verified_purchase BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,

  -- Voting system
  helpful_votes INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, product_id) -- One review per user per product
);

-- ===========================================
-- BADGES TABLE (Achievement system)
-- ===========================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',

  -- Badge criteria
  type TEXT NOT NULL CHECK (type IN ('upload', 'download', 'review', 'forum', 'achievement', 'special')),
  criteria JSONB, -- Flexible criteria storage

  -- Rarity and value
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  points_value INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- USER_BADGES TABLE (User earned badges)
-- ===========================================
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,

  -- Badge earning details
  earned_reason TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, badge_id) -- User can earn each badge only once
);

-- ===========================================
-- FILE_STORAGE TABLE (Track uploaded files)
-- ===========================================
CREATE TABLE file_storage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- File metadata
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  bucket_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,

  -- Usage context
  entity_type TEXT CHECK (entity_type IN ('product', 'avatar', 'attachment', 'temp')),
  entity_id UUID, -- Reference to the owning entity

  -- Access control
  is_public BOOLEAN DEFAULT false,
  access_token TEXT, -- For private file access

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- For temporary files
);

-- ===========================================
-- NOTIFICATIONS TABLE
-- ===========================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Notification content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('download', 'purchase', 'review', 'forum', 'system', 'achievement')),

  -- Related entities
  related_entity_type TEXT CHECK (related_entity_type IN ('product', 'thread', 'user', 'system')),
  related_entity_id UUID,

  -- Status
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- ===========================================
-- ANALYTICS TABLE (Usage tracking)
-- ===========================================
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Event data
  event_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- Context
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Users table indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_rank ON users(rank);
CREATE INDEX idx_users_is_premium ON users(is_premium);
CREATE INDEX idx_users_points ON users(points DESC);

-- Products table indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_author ON products(author_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_premium ON products(is_premium);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_views ON products(views DESC);
CREATE INDEX idx_products_rating ON products(rating DESC);
-- Note: Full-text search on tags will be handled by application logic
-- For now, we index title and description only
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_products_slug ON products(slug);

-- Threads table indexes
CREATE INDEX idx_threads_category ON threads(category_id);
CREATE INDEX idx_threads_author ON threads(author_id);
CREATE INDEX idx_threads_status ON threads(status);
CREATE INDEX idx_threads_pinned ON threads(is_pinned);
CREATE INDEX idx_threads_last_reply ON threads(last_reply_at DESC);
CREATE INDEX idx_threads_search ON threads USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_threads_slug ON threads(slug);

-- Replies table indexes
CREATE INDEX idx_replies_thread ON replies(thread_id);
CREATE INDEX idx_replies_author ON replies(author_id);
CREATE INDEX idx_replies_parent ON replies(parent_reply_id);
CREATE INDEX idx_replies_created ON replies(created_at DESC);

-- Downloads table indexes
CREATE INDEX idx_downloads_user ON downloads(user_id);
CREATE INDEX idx_downloads_product ON downloads(product_id);
CREATE INDEX idx_downloads_date ON downloads(downloaded_at DESC);

-- Purchases table indexes
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_product ON purchases(product_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_date ON purchases(purchased_at DESC);
CREATE INDEX idx_purchases_transaction ON purchases(transaction_id);

-- Reviews table indexes
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_helpful ON reviews(helpful_votes DESC);

-- Badges table indexes
CREATE INDEX idx_badges_type ON badges(type);
CREATE INDEX idx_badges_rarity ON badges(rarity);

-- User badges indexes
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

-- File storage indexes
CREATE INDEX idx_file_storage_user ON file_storage(user_id);
CREATE INDEX idx_file_storage_entity ON file_storage(entity_type, entity_id);
CREATE INDEX idx_file_storage_expires ON file_storage(expires_at) WHERE expires_at IS NOT NULL;

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Analytics indexes
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_user ON analytics(user_id);
CREATE INDEX idx_analytics_created ON analytics(created_at DESC);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- BASIC RLS POLICIES (Will be expanded in Phase 2)
-- ===========================================

-- Categories: Public read, admin write
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are manageable by admins" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Users: Users can read their own profile, admins can read all
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Products: Public read for published products, authors and admins can manage
CREATE POLICY "Published products are viewable by everyone" ON products
  FOR SELECT USING (status = 'published' AND is_active = true);

CREATE POLICY "Authors can manage their own products" ON products
  FOR ALL USING (auth.uid() = author_id);

-- Threads: Public read, authenticated users can create
CREATE POLICY "Threads are viewable by everyone" ON threads
  FOR SELECT USING (status = 'published' AND is_active = true);

CREATE POLICY "Authenticated users can create threads" ON threads
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their own threads" ON threads
  FOR UPDATE USING (auth.uid() = author_id);

-- Replies: Public read, authenticated users can create
CREATE POLICY "Replies are viewable by everyone" ON replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON replies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ===========================================
-- FUNCTIONS AND TRIGGERS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_replies_updated_at BEFORE UPDATE ON replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update thread reply count and last reply timestamp
CREATE OR REPLACE FUNCTION update_thread_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE threads SET
      replies_count = replies_count + 1,
      last_reply_at = NEW.created_at
    WHERE id = NEW.thread_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE threads SET
      replies_count = replies_count - 1,
      last_reply_at = (
        SELECT COALESCE(MAX(created_at), threads.created_at)
        FROM replies
        WHERE thread_id = threads.id
      )
    WHERE id = OLD.thread_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for updating thread statistics
CREATE TRIGGER update_thread_stats_trigger
  AFTER INSERT OR DELETE ON replies
  FOR EACH ROW EXECUTE FUNCTION update_thread_stats();

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE product_id = NEW.product_id
      AND is_hidden = false
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = NEW.product_id
      AND is_hidden = false
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating product rating
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- ===========================================
-- INITIAL DATA SEEDING
-- ===========================================

-- Insert default categories
INSERT INTO categories (name, slug, description, type, icon, color, sort_order) VALUES
  ('Design Resources', 'design-resources', 'Photoshop actions, templates, and design assets', 'product', '🎨', '#8B5CF6', 1),
  ('Marketing Tools', 'marketing-tools', 'SEO tools, social media templates, and marketing assets', 'product', '📊', '#3B82F6', 2),
  ('Software & Plugins', 'software-plugins', 'WordPress themes, plugins, and software tools', 'product', '💻', '#10B981', 3),
  ('Video & Audio', 'video-audio', 'Premiere presets, audio tools, and video resources', 'product', '🎬', '#F59E0B', 4),

  ('General Discussion', 'general-discussion', 'General topics and community chat', 'forum', '💬', '#6B7280', 1),
  ('Resource Requests', 'resource-requests', 'Request specific digital resources', 'forum', '🙏', '#EF4444', 2),
  ('Tutorials & Guides', 'tutorials-guides', 'Share tutorials and guides', 'forum', '📚', '#10B981', 3),
  ('Showcase', 'showcase', 'Show off your work and achievements', 'forum', '⭐', '#F59E0B', 4);

-- Insert default badges
INSERT INTO badges (name, slug, description, type, criteria, rarity, points_value) VALUES
  ('First Upload', 'first-upload', 'Upload your first resource', 'upload', '{"uploads": 1}', 'common', 10),
  ('Content Creator', 'content-creator', 'Upload 10 resources', 'upload', '{"uploads": 10}', 'uncommon', 50),
  ('Pro Creator', 'pro-creator', 'Upload 50 resources', 'upload', '{"uploads": 50}', 'rare', 200),
  ('Elite Creator', 'elite-creator', 'Upload 100 resources', 'upload', '{"uploads": 100}', 'epic', 500),

  ('First Download', 'first-download', 'Download your first resource', 'download', '{"downloads": 1}', 'common', 5),
  ('Regular User', 'regular-user', 'Download 25 resources', 'download', '{"downloads": 25}', 'uncommon', 25),
  ('Power User', 'power-user', 'Download 100 resources', 'download', '{"downloads": 100}', 'rare', 100),

  ('First Review', 'first-review', 'Write your first review', 'review', '{"reviews": 1}', 'common', 15),
  ('Review Master', 'review-master', 'Write 10 helpful reviews', 'review', '{"reviews": 10}', 'uncommon', 75),

  ('First Post', 'first-post', 'Create your first forum post', 'forum', '{"posts": 1}', 'common', 10),
  ('Active Member', 'active-member', 'Create 25 forum posts', 'forum', '{"posts": 25}', 'uncommon', 50),
  ('Forum Expert', 'forum-expert', 'Create 100 forum posts', 'forum', '{"posts": 100}', 'rare', 250),

  ('Welcome to Lanka.Digital', 'welcome', 'Join the Lanka.Digital community', 'achievement', '{}', 'common', 0),
  ('Early Adopter', 'early-adopter', 'One of the first 100 users', 'special', '{"user_id_limit": 100}', 'legendary', 1000);
