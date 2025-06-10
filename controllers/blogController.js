import Blog from '../models/Blog.js';
import { uploadBlog } from '../utils/uploadBlog.js';

export const createBlog = async (req, res) => {
    try {
        const { title, content, type } = req.body;
        let imageUrl = '';

        if (req.file) {
            imageUrl = await uploadBlog(req.file.buffer);
        }

        const blog = new Blog({ title, content, image: imageUrl, type });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { title, content ,type} = req.body;
        let updateData = { title, content,type };

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

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
