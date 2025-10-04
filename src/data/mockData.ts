export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  views: number;
  downloads: number;
  isPremium: boolean;
  thumbnail: string;
  author: string;
  uploadedAt: string;
}

export interface Thread {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRank: string;
  replies: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  lastActivity: string;
  content: string;
}

export interface User {
  id: string;
  name: string;
  rank: string;
  points: number;
  uploads: number;
  downloads: number;
  avatar: string;
  badges: string[];
  joinedAt: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Professional Photoshop Actions Pack',
    description: 'Collection of 50+ premium Photoshop actions for photographers',
    category: 'Design',
    tags: ['Photoshop', 'Photography', 'Actions'],
    views: 2341,
    downloads: 892,
    isPremium: false,
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'DesignMaster',
    uploadedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'WordPress Theme - Business Pro',
    description: 'Modern responsive WordPress theme perfect for businesses',
    category: 'Software',
    tags: ['WordPress', 'Theme', 'Business'],
    views: 5678,
    downloads: 1234,
    isPremium: true,
    thumbnail: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'ThemeCreator',
    uploadedAt: '5 hours ago',
  },
  {
    id: '3',
    title: 'Social Media Marketing Templates',
    description: '100+ Instagram & Facebook post templates',
    category: 'Marketing',
    tags: ['Social Media', 'Templates', 'Marketing'],
    views: 3421,
    downloads: 1567,
    isPremium: false,
    thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'MarketingPro',
    uploadedAt: '1 day ago',
  },
  {
    id: '4',
    title: 'React Component Library',
    description: 'Pre-built React components for faster development',
    category: 'Software',
    tags: ['React', 'Components', 'Development'],
    views: 4521,
    downloads: 892,
    isPremium: false,
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'CodeNinja',
    uploadedAt: '3 days ago',
  },
  {
    id: '5',
    title: 'UI/UX Design System - Complete Kit',
    description: 'Comprehensive design system with 200+ components',
    category: 'Design',
    tags: ['UI/UX', 'Design System', 'Figma'],
    views: 8234,
    downloads: 2341,
    isPremium: true,
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'UIExpert',
    uploadedAt: '1 week ago',
  },
  {
    id: '6',
    title: 'SEO Tools Collection',
    description: 'Essential SEO tools and scripts for optimization',
    category: 'Marketing',
    tags: ['SEO', 'Tools', 'Optimization'],
    views: 1892,
    downloads: 654,
    isPremium: false,
    thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'SEOGuru',
    uploadedAt: '2 days ago',
  },
  {
    id: '7',
    title: 'Video Editing Presets - Premiere Pro',
    description: 'Cinematic color grading presets for Adobe Premiere',
    category: 'Design',
    tags: ['Video', 'Premiere', 'Presets'],
    views: 3156,
    downloads: 987,
    isPremium: false,
    thumbnail: 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'VideoMaster',
    uploadedAt: '4 hours ago',
  },
  {
    id: '8',
    title: 'E-commerce Shopify Theme',
    description: 'Conversion-optimized Shopify theme for online stores',
    category: 'Software',
    tags: ['Shopify', 'E-commerce', 'Theme'],
    views: 6234,
    downloads: 1876,
    isPremium: true,
    thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'ShopBuilder',
    uploadedAt: '1 day ago',
  },
];

export const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Best free design resources for beginners?',
    category: 'General Chat',
    author: 'DesignNewbie',
    authorRank: 'Newbie',
    replies: 34,
    views: 892,
    isPinned: false,
    isLocked: false,
    lastActivity: '5 minutes ago',
    content: 'Hey everyone! I\'m just starting out with graphic design. What are the best free resources you\'d recommend for someone learning?',
  },
  {
    id: '2',
    title: '[PINNED] Welcome to Lanka.Digital - Read First!',
    category: 'Announcements',
    author: 'Admin',
    authorRank: 'Admin',
    replies: 156,
    views: 5234,
    isPinned: true,
    isLocked: false,
    lastActivity: '1 hour ago',
    content: 'Welcome to Lanka.Digital! Please read our community guidelines and rules before posting.',
  },
  {
    id: '3',
    title: 'Request: Need Figma to HTML conversion tools',
    category: 'Requests',
    author: 'WebDev123',
    authorRank: 'Contributor',
    replies: 12,
    views: 234,
    isPinned: false,
    isLocked: false,
    lastActivity: '2 hours ago',
    content: 'Does anyone have good tools or plugins for converting Figma designs to HTML/CSS code?',
  },
  {
    id: '4',
    title: 'Tutorial: How to optimize WordPress site speed',
    category: 'Tutorials',
    author: 'SpeedExpert',
    authorRank: 'Expert',
    replies: 67,
    views: 1892,
    isPinned: false,
    isLocked: false,
    lastActivity: '3 hours ago',
    content: 'Complete guide on optimizing WordPress performance. Covers caching, image optimization, and more.',
  },
  {
    id: '5',
    title: 'Sharing my collection of 1000+ icons',
    category: 'Resources',
    author: 'IconCollector',
    authorRank: 'Elite Member',
    replies: 89,
    views: 3421,
    isPinned: false,
    isLocked: false,
    lastActivity: '1 day ago',
    content: 'I\'ve compiled a massive collection of free icons from various sources. Check it out!',
  },
  {
    id: '6',
    title: 'Discussion: AI tools impact on design industry',
    category: 'General Chat',
    author: 'TechThinking',
    authorRank: 'Contributor',
    replies: 45,
    views: 1234,
    isPinned: false,
    isLocked: false,
    lastActivity: '5 hours ago',
    content: 'What are your thoughts on AI design tools? Are they helping or hurting the industry?',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'DesignMaster',
    rank: 'Elite Member',
    points: 15420,
    uploads: 234,
    downloads: 1892,
    avatar: '👑',
    badges: ['Top Contributor', '100 Uploads', 'Helpful'],
    joinedAt: 'Jan 2024',
  },
  {
    id: '2',
    name: 'CodeNinja',
    rank: 'Expert',
    points: 12340,
    uploads: 187,
    downloads: 1456,
    avatar: '🥷',
    badges: ['Top Contributor', '50 Uploads'],
    joinedAt: 'Feb 2024',
  },
  {
    id: '3',
    name: 'MarketingPro',
    rank: 'Expert',
    points: 10890,
    uploads: 156,
    downloads: 1234,
    avatar: '📊',
    badges: ['50 Uploads', 'Helpful'],
    joinedAt: 'Mar 2024',
  },
  {
    id: '4',
    name: 'UIExpert',
    rank: 'Contributor',
    points: 8765,
    uploads: 123,
    downloads: 987,
    avatar: '🎨',
    badges: ['50 Uploads'],
    joinedAt: 'Mar 2024',
  },
  {
    id: '5',
    name: 'ThemeCreator',
    rank: 'Contributor',
    points: 7234,
    uploads: 98,
    downloads: 876,
    avatar: '🛠️',
    badges: ['Helpful'],
    joinedAt: 'Apr 2024',
  },
];
