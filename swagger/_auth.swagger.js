/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: 회원정보를 입력하여 회원가입을 진행합니다.
 *     tags: [Auth]
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
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "회원가입에 성공하였습니다."
 *                 status: { type: 'string', example: 'string' }
 *                 serverDateTime: { type: 'string', example: 'string' }
 *                 errorCode: { type: 'string', nullable: true, example: 'string' }
 *                 errorMessage: { type: 'string', nullable: true, example: 'string' }
 *
 *       400:
 *         description: 회원가입 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       409:
 *         description: 사용자 충돌
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
 *     tags: [Auth]
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     nickname:
 *                       type: string
 *                       example: "클리퍼"
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: JWT 재발급
 *     description: 사용자의 토큰을 재발급합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *
 */

/**
 * @swagger
 * /api/auth/check/duplicateNickname/{nickname}:
 *   post:
 *     summary: 닉네임 중복확인
 *     description: 닉네임 중복확인을 진행합니다.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     isDuplicated:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "사용할 수 있는 닉네임입니다."
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       409:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *
 */

/**
 * @swagger
 * /api/auth/check/duplicateId/{userId}:
 *   post:
 *     summary: 아이디 중복확인
 *     description: 회원가입시 아이디 중복확인을 진행합니다.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 아이디 중복확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     isDuplicated:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "사용할 수 있는 아이디입니다."
 *                     status: { type: 'string', example: 'SUCCESS' }
 *                     serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                     errorCode: { type: 'string', nullable: true, example: null }
 *                     errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *
 */
