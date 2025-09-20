import { getCloudant } from "../lib/cloudant.js";
import crypto from "crypto";

export async function createSocialPost(req, res) {
  try {
    const { platform, content, scheduledTime, hashtags, imageUrl, channel, message } = req.body;
    
    // Support both parameter formats
    const finalPlatform = platform || channel;
    const finalContent = content || message;
    
    if (!finalPlatform || !finalContent) {
      return res.status(400).json({
        success: false,
        error: "Platform/channel and content/message are required"
      });
    }

    const db = getCloudant();
    const postId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const socialPost = {
      _id: `social_post:${postId}`,
      type: "social_post",
      postId,
      platform: finalPlatform, // facebook, twitter, instagram, linkedin, tiktok
      content: finalContent,
      hashtags: hashtags || [],
      imageUrl: imageUrl || null,
      scheduledTime: scheduledTime || now,
      status: scheduledTime ? "scheduled" : "published",
      createdAt: now,
      updatedAt: now,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0,
        clicks: 0,
        impressions: 0
      }
    };

    // Store social post
    await db.insert('social_posts', socialPost);
    
    // Simulate platform-specific response
    const platformResponses = {
      facebook: { postUrl: `https://facebook.com/posts/${postId}` },
      twitter: { tweetUrl: `https://twitter.com/spiral/status/${postId}` },
      x: { tweetUrl: `https://x.com/spiral/status/${postId}` },
      instagram: { postUrl: `https://instagram.com/p/${postId}` },
      linkedin: { postUrl: `https://linkedin.com/posts/spiral-${postId}` },
      tiktok: { videoUrl: `https://tiktok.com/@spiral/video/${postId}` },
      truth: { postUrl: `https://truthsocial.com/@spiral/posts/${postId}` }
    };

    res.json({
      success: true,
      postId,
      status: socialPost.status,
      platform: finalPlatform,
      message: `Social post ${socialPost.status} successfully on ${finalPlatform}`,
      platformResponse: platformResponses[finalPlatform] || {},
      post: socialPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create social post",
      message: error.message
    });
  }
}