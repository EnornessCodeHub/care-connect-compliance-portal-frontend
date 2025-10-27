import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Plus, 
  Search,
  Filter,
  ThumbsUp,
  MessageCircle,
  Share,
  Bookmark,
  Flag,
  Edit,
  Trash2,
  Pin,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  Eye,
  Reply,
  MoreVertical
} from 'lucide-react';

interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  isFeatured: boolean;
  isResolved: boolean;
  lastReply?: {
    author: string;
    timestamp: Date;
  };
}

interface DiscussionCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: any;
  postCount: number;
}

const discussionCategories: DiscussionCategory[] = [
  {
    id: 'general',
    name: 'General Discussion',
    description: 'General topics and announcements',
    color: 'bg-blue-500',
    icon: MessageSquare,
    postCount: 45
  },
  {
    id: 'compliance',
    name: 'Compliance & Regulations',
    description: 'NDIS compliance and regulatory discussions',
    color: 'bg-red-500',
    icon: TrendingUp,
    postCount: 23
  },
  {
    id: 'training',
    name: 'Training & Development',
    description: 'Training resources and skill development',
    color: 'bg-green-500',
    icon: Star,
    postCount: 18
  },
  {
    id: 'incidents',
    name: 'Incident Management',
    description: 'Incident reporting and management discussions',
    color: 'bg-orange-500',
    icon: Flag,
    postCount: 12
  },
  {
    id: 'best-practices',
    name: 'Best Practices',
    description: 'Sharing best practices and tips',
    color: 'bg-purple-500',
    icon: ThumbsUp,
    postCount: 31
  },
  {
    id: 'support',
    name: 'Technical Support',
    description: 'Technical issues and platform support',
    color: 'bg-gray-500',
    icon: Users,
    postCount: 8
  }
];

const mockPosts: DiscussionPost[] = [
  {
    id: '1',
    title: 'New NDIS Compliance Updates - Important Changes',
    content: 'The NDIS has released new compliance requirements that will affect our operations. Key changes include updated incident reporting procedures and enhanced documentation requirements. Please review the attached documents and let me know if you have any questions.',
    author: {
      id: '1',
      name: 'Dr. Emma Thompson',
      role: 'Compliance Manager'
    },
    category: 'compliance',
    tags: ['ndis', 'compliance', 'updates'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 24,
    replies: 8,
    views: 156,
    isPinned: true,
    isFeatured: true,
    isResolved: false,
    lastReply: {
      author: 'Michael Chen',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  },
  {
    id: '2',
    title: 'Best Practices for Staff Onboarding',
    content: 'I wanted to share some best practices we\'ve developed for staff onboarding that have significantly improved our process. The key is to have a structured checklist and regular check-ins during the first month.',
    author: {
      id: '2',
      name: 'Sarah Wilson',
      role: 'HR Manager'
    },
    category: 'best-practices',
    tags: ['onboarding', 'hr', 'best-practices'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    likes: 18,
    replies: 5,
    views: 89,
    isPinned: false,
    isFeatured: false,
    isResolved: false,
    lastReply: {
      author: 'Jennifer Lee',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1)
    }
  },
  {
    id: '3',
    title: 'Training Module Feedback - Incident Reporting',
    content: 'I just completed the new incident reporting training module and wanted to provide some feedback. The interactive elements were great, but I think we could add more real-world scenarios. What do others think?',
    author: {
      id: '3',
      name: 'John Smith',
      role: 'Support Worker'
    },
    category: 'training',
    tags: ['training', 'feedback', 'incident-reporting'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    likes: 12,
    replies: 3,
    views: 67,
    isPinned: false,
    isFeatured: false,
    isResolved: true,
    lastReply: {
      author: 'Training Team',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3)
    }
  },
  {
    id: '4',
    title: 'System Maintenance Scheduled for This Weekend',
    content: 'We will be performing scheduled system maintenance this weekend from 10 PM Saturday to 6 AM Sunday. During this time, the platform will be unavailable. Please plan accordingly and save any work in progress.',
    author: {
      id: '4',
      name: 'IT Support Team',
      role: 'System Administrator'
    },
    category: 'support',
    tags: ['maintenance', 'system', 'announcement'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    likes: 6,
    replies: 2,
    views: 134,
    isPinned: true,
    isFeatured: false,
    isResolved: false
  }
];

export default function CommunityBoard() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  const filteredPosts = mockPosts
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'trending':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    // In a real app, this would make an API call
    console.log('Creating new post:', newPost);
    setNewPost({ title: '', content: '', category: 'general', tags: '' });
    setShowNewPost(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getCategoryData = (categoryId: string) => {
    return discussionCategories.find(c => c.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Community Discussion Board
            </h1>
            <p className="text-muted-foreground mt-1">
              Peer-to-peer knowledge sharing and community discussions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button onClick={() => setShowNewPost(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory('all')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  All Discussions
                  <Badge variant="secondary" className="ml-auto">
                    {mockPosts.length}
                  </Badge>
                </Button>
                {discussionCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.name}
                    <Badge variant="secondary" className="ml-auto">
                      {category.postCount}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Posts</span>
                  <span className="font-medium">{mockPosts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="font-medium">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resolved Issues</span>
                  <span className="font-medium">89</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedCategory === 'all' ? 'All Discussions' : 
                     discussionCategories.find(c => c.id === selectedCategory)?.name}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'trending')}
                      className="p-2 border rounded-md text-sm"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                      <option value="trending">Trending</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {filteredPosts.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No discussions found</p>
                        <p className="text-sm mt-1">
                          {searchQuery ? 'Try adjusting your search' : 'No discussions in this category'}
                        </p>
                      </div>
                    ) : (
                      filteredPosts.map((post) => {
                        const categoryData = getCategoryData(post.category);
                        
                        return (
                          <Card key={post.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      {post.isPinned && (
                                        <Pin className="h-4 w-4 text-blue-500" />
                                      )}
                                      {post.isFeatured && (
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                      )}
                                      <h3 className="font-semibold text-lg">{post.title}</h3>
                                      {post.isResolved && (
                                        <Badge variant="secondary" className="text-xs">
                                          Resolved
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {post.content}
                                    </p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {post.author.name}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatTimeAgo(post.createdAt)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-3 w-3" />
                                    {post.likes}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    {post.replies}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {post.views}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {categoryData && (
                                      <Badge 
                                        variant="outline" 
                                        className="text-xs"
                                        style={{ backgroundColor: categoryData.color + '20', borderColor: categoryData.color }}
                                      >
                                        {categoryData.name}
                                      </Badge>
                                    )}
                                    <div className="flex items-center gap-1">
                                      {post.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                          <Tag className="h-3 w-3 mr-1" />
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      Like
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Reply className="h-4 w-4 mr-1" />
                                      Reply
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Bookmark className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {post.lastReply && (
                                  <div className="text-xs text-muted-foreground border-t pt-2">
                                    Last reply by {post.lastReply.author} {formatTimeAgo(post.lastReply.timestamp)}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4">
              <CardHeader>
                <CardTitle>Create New Discussion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter discussion title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {discussionCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your discussion content..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                  <Input
                    value={newPost.tags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., compliance, training, best-practices"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>
                    Create Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
