const express = require('express');
const { KV } = require('./models');

const apiRouter = express.Router();

apiRouter.get('/kv', async (req, res) => {
  try {
    const kvs = await KV.findAll();
    if (kvs && kvs.length > 0) {
      return res.json({data: kvs});
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/kv/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const kv = await KV.findOne({ where: { key } });
        if (kv) {
            return res.json({ data: kv });
        } else {
            return res.status(404).json({ error: 'Key not found' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

apiRouter.post('/kv', async (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) {
        return res.status(400).json({ error: 'Key and value are required' });
    }
    try {
        const exists = await KV.findOne({where: { key }});
        if (exists) {
            return res.status(400).json({ error: 'Key already exists' });
        }

        const kv = await KV.create({ key, value });
        return res.status(201).json({ data: kv });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

apiRouter.put('/kv/:key', async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    if (!value) {
        return res.status(400).json({ error: 'Value is required' });
    }
    try {
        const [updatedCount] = await KV.update({ value }, { where: { key } });
        if (updatedCount === 0) {
            return res.status(404).json({ error: 'Key not found' });
        }

        const kv = await KV.findOne({ where: { key } });
        return res.status(200).json({ data: kv });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

apiRouter.delete('/kv/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const kv = await KV.findOne({ where: { key } });
        if (!kv) {
            return res.status(404).json({ error: 'Key not found' });
        }

        await kv.destroy();
        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


module.exports = apiRouter;