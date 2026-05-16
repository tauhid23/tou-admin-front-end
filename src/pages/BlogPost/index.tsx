import { useState } from "react";
import { Plus, Edit3, Trash2, Eye, Calendar, User, Check, X } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  status: "published" | "draft";
  slug: string;
}

const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Summer Fashion Trends You Need in 2025",
    excerpt: "Discover the hottest trends dominating this season.",
    content: "Full blog content here...",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    author: "Admin",
    date: "2025-05-10",
    status: "published",
    slug: "summer-fashion-trends-2025",
  },
];

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  const addNewPost = () => {
    const newPost: BlogPost = {
      id: Date.now(),
      title: "",
      excerpt: "",
      content: "",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
      author: "Admin",
      date: new Date().toISOString().split("T")[0],
      status: "draft",
      slug: "",
    };
    setEditingPost(newPost);
  };

  const savePost = () => {
    if (!editingPost) return;

    if (posts.find(p => p.id === editingPost.id)) {
      setPosts(prev => prev.map(p => p.id === editingPost.id ? editingPost : p));
    } else {
      setPosts(prev => [...prev, editingPost]);
    }
    setEditingPost(null);
  };

  const deletePost = (id: number) => {
    if (confirm("Delete this blog post?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-500 mt-1">Manage your store blog content</p>
          </div>
          <button
            onClick={addNewPost}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition"
          >
            <Plus size={20} /> New Blog Post
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition">
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {post.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={14} /> {post.date}
                  </span>
                </div>

                <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <User size={16} /> {post.author}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setPreviewPost(post); setShowPreview(true); }} className="p-2 hover:bg-gray-100 rounded-xl">
                      <Eye size={20} />
                    </button>
                    <button onClick={() => setEditingPost(post)} className="p-2 hover:bg-gray-100 rounded-xl">
                      <Edit3 size={20} />
                    </button>
                    <button onClick={() => toggleStatus(post.id)} className="p-2 hover:bg-gray-100 rounded-xl">
                      {post.status === "published" ? <X size={20} className="text-red-500" /> : <Check size={20} className="text-emerald-500" />}
                    </button>
                    <button onClick={() => deletePost(post.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-auto">
            <div className="p-8 border-b">
              <h2 className="text-2xl font-semibold">{editingPost.id ? "Edit Post" : "Create New Post"}</h2>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3"
                  placeholder="Blog post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                <input
                  value={editingPost.image}
                  onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3 h-24"
                  placeholder="Short description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Full Content</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3 h-64"
                  placeholder="Write your blog content here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={editingPost.date}
                    onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 border-t flex justify-end gap-4">
              <button onClick={() => setEditingPost(null)} className="px-8 py-3 rounded-2xl hover:bg-gray-100">Cancel</button>
              <button onClick={savePost} className="bg-black text-white px-8 py-3 rounded-2xl hover:bg-gray-800">Save Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewPost && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <img src={previewPost.image} alt="" className="w-full h-80 object-cover" />
            <div className="p-10">
              <h1 className="text-3xl font-bold mb-4">{previewPost.title}</h1>
              <p className="text-gray-500 mb-8">{previewPost.excerpt}</p>
              <div className="prose max-w-none">{previewPost.content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}