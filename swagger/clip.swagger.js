/**
 * @swagger
 * components:
 *   schemas:
 *     Clip:
 *       type: object
 *       properties:
 *         title: { type: 'string', example: '효율적인 토큰 관리 방법' }
 *         tagId: { type: 'integer', example: 6 }
 *         url: { type: 'string', example: 'https://velog.io/...' }
 *         thumbnail: { type: 'string', nullable: true, example: 'https://...' }
 *         tagName: { type: 'string', nullable: true, example: '개발' }
 *         memo: { type: 'string', nullable: true, example: '토큰 관리는 보안과 성능에 큰 영향을 미칩니다...' }
 *         createdAt: { type: 'string', format: 'date-time', example: '2025-09-19T14:30:00.000Z' }
 *     ClipsData:
 *       type: object
 *       properties:
 *         size: { type: 'integer', example: 20 }
 *         content:
 *           type: array
 *           items: { $ref: '#/components/schemas/Clip' }
 *         number: { type: 'integer', example: 0 }
 *         numberOfElements: { type: 'integer', example: 1 }
 *         first: { type: 'boolean', example: true }
 *         last: { type: 'boolean', example: true }
 *         empty: { type: 'boolean', example: false }
 */

/**
 * @swagger
 * /api/clips:
 *   post:
 *     summary: 클립 생성
 *     description: 클립을 생성합니다.
 *     tags: [Clip - 클립 API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               memo:
 *                 type: string
 *               tagName:
 *                 type: string
 *     responses:
 *       200:
 *         description: 클립 생성 성공
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
 *                       example: "클립 생성을 성공하였습니다."
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 클립 생성 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/clips:
 *   get:
 *     summary: 클립 전체 조회
 *     description: 모든 클립의 제목, 태그이름, 메모, 생성시간과 무한스크롤 관련정보를 가져옵니다.
 *     tags: [Clip - 클립 API]
 *     parameters:
 *       - in: query
 *         name: lastCreatedAt
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: 클립 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ClipsData'
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 클립 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/clips/{clipId}:
 *   get:
 *     summary: 특정 클립 상세 조회
 *     description: 특정 클립의 상세 내역을 가져옵니다.
 *     tags: [Clip - 클립 API]
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         description: 특정 클립의 고유 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 특정 클립 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Clip'
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       400:
 *         description: 특정 클립 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/clips/{clipId}:
 *   delete:
 *     summary: 클립 삭제
 *     description: 특정 클립을 삭제합니다.
 *     tags: [Clip - 클립 API]
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         description: 삭제할 클립의 고유 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 클립 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "클립이 성공적으로 삭제되었습니다."
 *       404:
 *         description: 클립을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */

/**
 * @swagger
 * /api/clips/{clipId}:
 *   put:
 *     summary: 클립 내용 수정
 *     description: 특정 클립의 내용을 수정합니다.
 *     tags: [Clip - 클립 API]
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               tagName:
 *                 type: string
 *               memo:
 *                 type: string
 *     responses:
 *       200:
 *         description: 클립 수정 성공
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
 *                       example: "클립이 성공적으로 삭제되었습니다."
 *                 status: { type: 'string', example: 'SUCCESS' }
 *                 serverDateTime: { type: 'string', example: '2025-09-19T14:30:00.000Z' }
 *                 errorCode: { type: 'string', nullable: true, example: null }
 *                 errorMessage: { type: 'string', nullable: true, example: null }
 *       404:
 *         description: 클립을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */
