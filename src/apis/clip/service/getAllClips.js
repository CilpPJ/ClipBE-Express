import { findAllClips } from '../repository/findAllClips.js';

export const getAllClips = async () => {
  const clipsContent = await findAllClips();

  const response = {
    size: 20,
    content: clipsContent,
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
    numberOfElements: clipsContent.length,
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
    empty: clipsContent.length === 0,
  };

  return response;
};
