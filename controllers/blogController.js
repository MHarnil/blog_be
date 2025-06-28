import Blog from '../models/Blog.js';
import { uploadBlog } from '../utils/uploadBlog.js';

// Helper to generate unique slug
const generateUniqueSlug = async (title, blogId = null) => {
    let baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let count = 1;

    while (true) {
        const existingBlog = await Blog.findOne({ url: slug });

        if (!existingBlog || (blogId && existingBlog._id.equals(blogId))) break;

        slug = `${baseSlug}-${count++}`;
    }

    return slug;
};

// CREATE
export const createBlog = async (req, res) => {
    try {
        const { title, excerpt, content, author, tags, category } = req.body;
        let imageUrl = '';

        if (req.file) {
            imageUrl = await uploadBlog(req.file.buffer);
        }

        const url = await generateUniqueSlug(title);

        const blog = new Blog({
            title,
            excerpt,
            content,
            author,
            url,
            tags: tags ? JSON.parse(tags) : [],
            category,
            image: imageUrl
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ ALL
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('category').sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ ONE BY ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('category');
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE
export const updateBlog = async (req, res) => {
    try {
        const { title, excerpt, content, author, tags, category } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Check if title is changing
        if (title && title !== blog.title) {
            blog.url = await generateUniqueSlug(title, blog._id);
            blog.title = title;
        }

        blog.excerpt = excerpt ?? blog.excerpt;
        blog.content = content ?? blog.content;
        blog.author = author ?? blog.author;
        blog.tags = tags ? JSON.parse(tags) : blog.tags;
        blog.category = category ?? blog.category;

        if (req.file) {
            const imageUrl = await uploadBlog(req.file.buffer);
            blog.image = imageUrl;
        }

        await blog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
