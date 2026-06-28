import express from 'express';
import Work from '../models/Work.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// 所有作品路由都需要登录验证
router.use(authMiddleware);

// 1. 获取当前用户的所有作品
router.get('/', async (req, res) => {
  try {
    const works = await Work.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(works);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '获取作品列表失败' });
  }
});

// 2. 添加新作品
router.post('/', async (req, res) => {
  try {
    const newWork = new Work({
      ...req.body,
      user: req.user.id
    });
    const savedWork = await newWork.save();
    res.status(201).json(savedWork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '添加作品失败' });
  }
});

// 3. 更新作品 (包括 AI 优化结果、是否加入作品集等)
router.put('/:id', async (req, res) => {
  try {
    // 确保只能更新自己的作品
    const work = await Work.findOne({ _id: req.params.id, user: req.user.id });
    if (!work) {
      return res.status(404).json({ message: '未找到该作品或无权修改' });
    }

    const updatedWork = await Work.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // 返回更新后的文档
    );

    res.json(updatedWork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '更新作品失败' });
  }
});

// 4. 删除作品
router.delete('/:id', async (req, res) => {
  try {
    const work = await Work.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!work) {
      return res.status(404).json({ message: '未找到该作品或无权删除' });
    }
    res.json({ message: '作品已删除' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '删除作品失败' });
  }
});

export default router;
