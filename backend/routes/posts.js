const express = require("express");
const router = express.Router();
const multer = require("multer");
const postService = require("../services/postService");

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, and documents
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("application/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

router.post(
  "/create_post",
  upload.single("attachment"),
  postService.createPost
);
router.get("/get_posts", postService.getPosts);// done
router.get("/get_posts_by_uid", postService.getPostsByUid); // done
router.post("/:postId/like", postService.likePost); // done
router.post("/:postId/comment", postService.addComment);  // done
router.post('/:postId/comments/:commentId/like', postService.likeComment); // done
router.get('/events', postService.subscribeToPostEvents);

module.exports = router;
