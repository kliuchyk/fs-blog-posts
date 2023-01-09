import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('author').exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Failed to get list of posts',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Failed to get the post' });
        }

        if (!doc) {
          return res.status(404).json({ message: 'Post is not found' });
        }

        res.json(doc);
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get the post' });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: 'Failed to remove the post' });
        }

        if (!doc) {
          return res.status(404).json({ message: 'Post is not found' });
        }

        return res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to remove the post' });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      author: req.userId,
    });

    const post = await doc.save();

    return res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post creation failed',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        author: req.userId,
      },
      { returnDocument: 'after' },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Failed to get the post' });
        }

        if (!doc) {
          return res.status(404).json({ message: 'Post is not found' });
        }

        res.json(doc);
      },
    );
  } catch (error) {}
};

export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Failed to get list of tags',
    });
  }
};
