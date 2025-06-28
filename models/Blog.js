import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String },
    content: { type: String },
    author: { type: String },
    url: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: { type: String }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
