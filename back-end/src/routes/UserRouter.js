const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleware, authUserMiddleware, authAdminMiddleware, authHRMiddleware } = require("../middleware/authMiddleware");

router.post("/sign-up", authAdminMiddleware, userController.createUser);
router.post("/sign-in", userController.login);
router.put("/update-user/:id", userController.updateUser);
router.get("/get-all-user", authAdminMiddleware, userController.getAllUsers);
// router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.get("/get-details/:id", authUserMiddleware, userController.getDetailsUser);
router.post('/refresh-token', userController.refreshToken);
router.post("/change-password", userController.changePassword);
router.post("/log-out", userController.logoutUser);




module.exports = router;
