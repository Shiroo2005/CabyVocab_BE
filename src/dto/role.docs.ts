/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Quản lý vai trò (roles)
 */

/**
 * @swagger
 * /api/roles/all:
 *   get:
 *     summary: Lấy danh sách tất cả vai trò
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Trả về danh sách vai trò
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của vai trò
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò cần lấy thông tin
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết vai trò
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: Không tìm thấy vai trò
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Tạo vai trò mới
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên vai trò mới
 *     responses:
 *       201:
 *         description: Vai trò được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Cập nhật thông tin vai trò
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên mới của vai trò
 *     responses:
 *       200:
 *         description: Vai trò được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: Không tìm thấy vai trò
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Xóa vai trò theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò cần xóa
 *     responses:
 *       200:
 *         description: Vai trò được xóa thành công
 *       404:
 *         description: Không tìm thấy vai trò
 */
