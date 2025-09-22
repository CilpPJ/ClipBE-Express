/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: 친구 검색
 *     description: 친구를 검색합니다.
 *     tags: [Friends - 친구 API]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         required: true
 *         description: 검색할 친구의 닉네임
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 친구 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                         example: "클리퍼"
 *                       isFriend:
 *                         type: boolean
 *                         example: false
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 친구 검색 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/friends:
 *   post:
 *     summary: 친구 신청
 *     description: 특정 사용자에게 친구 신청(요청)을 보냅니다.
 *     tags: [Friends - 친구 API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 추가할 친구의 닉네임
 *                 example: "클리퍼"
 *     responses:
 *       200:
 *         description: 친구 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "b9b6e1a8-2f3a-4b2a-9f7a-123456789abc"
 *                     nickname:
 *                       type: string
 *                       example: "클리퍼"
 *                     isFriend:
 *                       type: boolean
 *                       example: false
 *                     friendshipStatus:
 *                       type: string
 *                       enum: [PENDING, ACCEPTED, REJECTED]
 *                       example: PENDING
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 친구 추가 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/friends/{nickname}:
 *   delete:
 *     summary: 친구 삭제
 *     description: 친구를 삭제합니다.
 *     tags: [Friends - 친구 API]
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         description: 삭제할 친구의 닉네임
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 친구 삭제 성공
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
 *                     isFriend:
 *                       type: boolean
 *                       example: true
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 친구 삭제 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/friends/my:
 *   get:
 *     summary: 내 친구 보기
 *     description: 내 친구 목록을 보여줍니다.
 *     tags: [Friends - 친구 API]
 *     responses:
 *       200:
 *         description: 내 친구 목록 보기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                       isFriend:
 *                         type: boolean
 *                         example: true
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 내 친구 목록 보기 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/friends:
 *   put:
 *     summary: 친구 신청 수락/거절
 *     description: 친구 신청을 수락하거나 거절합니다.
 *     tags: [Friends - 친구 API]
 *     responses:
 *       200:
 *         description: 친구 신청 수락/거절 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                       isFriend:
 *                         type: boolean
 *                         example: true
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 친구 신청 수락/거절 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/friends/apply-list:
 *   get:
 *     summary: 내 친구 신청 목록 보기
 *     description: 내 친구 신청 목록을 보여줍니다.
 *     tags: [Friends - 친구 API]
 *     responses:
 *       200:
 *         description: 내 친구 신청 목록 보기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                       isFriend:
 *                         type: boolean
 *                         example: true
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 내 친구 신청 목록 보기 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */
