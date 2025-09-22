import { createSuccessResponse } from '../../../utils/responseFormatter.js';
import { findClipById } from '../repository/findClipById.js';

export const getClipById = async (clipId) => {
  const rawClipData = await findClipById(clipId);

  const processedClip = {
    title: rawClipData.title,
    tagId: rawClipData.tag_id,
    url: rawClipData.url,
    thumbnail: rawClipData.thumbnail,
    tagName: rawClipData.tags?.name || null,
    memo: rawClipData.memo,
    createdAt: rawClipData.created_at,
  };

  return createSuccessResponse(processedClip);
};
