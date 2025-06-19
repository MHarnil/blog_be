import Blog from '../models/Blog.js';
import { uploadBlog } from '../utils/uploadBlog.js';

// Create Blog
export const createBlog = async (req, res) => {
    try {
        const { title, excerpt, content, author, tags, category } = req.body;
        let imageUrl = '';

        if (req.file) {
            imageUrl = await uploadBlog(req.file.buffer);
        }

        const blog = new Blog({
            title,
            excerpt,
            content,
            author,
            tags: tags ? JSON.parse(tags) : [], // If sent as stringified array
            category,
            image: imageUrl
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('category').sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Blog By ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('category');
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Blog
export const updateBlog = async (req, res) => {
    try {
        const { title, excerpt, content, author, tags, category } = req.body;
        let updateData = {
            title,
            excerpt,
            content,
            author,
            tags: tags ? JSON.parse(tags) : [],
            category
        };

        if (req.file) {
            const imageUrl = await uploadBlog(req.file.buffer);
            updateData.image = imageUrl;
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
