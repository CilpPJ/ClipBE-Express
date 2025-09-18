/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: 회원정보를 입력하여 회원가입을 진행합니다.
 *     tags: [Auth - 회원 인증 API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               password:
 *                 type: string
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입에 성공하였습니다."
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입에 실패하였습니다."
 *       409:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 등록된 사용자입니다."
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     description: 아이디와 비밀번호를 입력하여 로그인을 진행합니다.
 *     tags: [Auth - 회원 인증 API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인에 성공하였습니다."
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인에 실패하였습니다."
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "아이디 또는 비밀번호가 잘못되었습니다."
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: JWT 재발급 [미구현]
 *     description: 사용자의 토큰을 재발급합니다.
 *     tags: [Auth - 회원 인증 API]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰 재발급에 성공하였습니다."
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰 재발급에 실패하였습니다."
 *
 */

/**
 * @swagger
 * /api/auth/check/duplicateNickname/{nickname}:
 *   post:
 *     summary: 닉네임 중복확인
 *     description: 닉네임 중복확인을 진행합니다.
 *     tags: [Auth - 회원 인증 API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "사용할 수 있는 휴대폰번호입니다."
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "휴대폰번호 중복확인에 실패하였습니다."
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 사용중인 휴대폰번호입니다."
 *
 */

/**
 * @swagger
 * /api/auth/check/duplicateId/{userId}:
 *   post:
 *     summary: 아이디 중복확인 [미구현]
 *     description: 회원가입시 아이디 중복확인을 진행합니다.
 *     tags: [Auth - 회원 인증 API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "사용할 수 있는 아이디입니다."
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "아이디 중복확인에 실패하였습니다."
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 사용중인 아이디입니다."
 *
 */
