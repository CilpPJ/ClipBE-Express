import { createSuccessResponse } from '../../../utils/responseFormatter.js';
import { findAllClips } from '../repository/findAllClips.js';

export const getAllClips = async () => {
  const rawClipsData = await findAllClips();

  const processedContent = rawClipsData.map((clip) => ({
    title: clip.title,
    tagId: clip.tag_id,
    url: clip.url,
    thumbnail: clip.thumbnail,
    tagName: clip.tags.name,
    memo: clip.memo,
    createdAt: clip.created_at,
  }));

  const responseData = {
    size: 20,
    content: processedContent,
    number: 0,
    sort: [
      {
        direction: 'DESC',
        nullHandling: 'NATIVE',
        ascending: false,
        property: 'createdAt',
        ignoreCase: false,
      },
    ],
    numberOfElements: processedContent.length,
    pageable: {
      offset: 0,
      sort: [
        {
          direction: 'DESC',
          nullHandling: 'NATIVE',
          ascending: false,
          property: 'createdAt',
          ignoreCase: false,
        },
      ],
      paged: true,
      pageNumber: 0,
      pageSize: 20,
      unpaged: false,
    },
    first: true,
    last: true,
    empty: processedContent.length === 0,
  };

  return createSuccessResponse(responseData);
};
