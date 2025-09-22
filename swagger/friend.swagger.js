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
 *     summary: 친구 추가
 *     description: 친구를 추가합니다.
 *     tags: [Friends - 친구 API]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         required: true
 *         description: 추가할 친구의 닉네임
 *         schema:
 *           type: string
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
 *         description: 친구 추가 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/friends:
 *   delete:
 *     summary: 친구 삭제
 *     description: 친구를 삭제합니다.
 *     tags: [Friends - 친구 API]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         required: true
 *         description: 추가할 친구의 닉네임
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
