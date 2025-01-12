const { getIO } = require("../socket");
const redis = require("redis");
const client = redis.createClient({ url: 'redis://default:7yZMF3RYUWDKMnGSkGgQuo1OANqHYdnM@redis-16063.c278.us-east-1-4.ec2.redns.redis-cloud.com:16063', legacyMode: false });

client.on("error", (err) => console.error("Redis Client Error", err));
client.connect();

exports.addTag = async (req, res) => {
    try {
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: "Tag name is required." });
      }
  
      const newTag = { id: `tag.${Date.now()}`, name };
  
      const tagsData = await client.get("tags");
      const tags = tagsData ? JSON.parse(tagsData) : [];
  
      tags.push(newTag);
  
      await client.set("tags", JSON.stringify(tags));
  
      res.status(201).json(newTag);
    } catch (error) {
      console.error("Error adding tag:", error);
      res.status(500).json({ error: "Failed to add tag." });
    }
  };
  

  exports.getTags = async (req, res) => {
    try {
      const tagsData = await client.get("tags");
      const tags = tagsData ? JSON.parse(tagsData) : [];
  
      res.status(200).json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags." });
    }
  };
  