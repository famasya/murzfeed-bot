interface PspsPostItem {
  murzFeedPostId: string;
  fileURL: string;
  teaCategory: Array<string>;
  teaTitleSlug: string;
  endAt: number;
  status: string;
  teaSource: string;
  feedCommentsCount: string;
  murzBankId: string;
  feedPawsCount: number;
  isFromMurzFeedPost: boolean;
  startAt: number;
  updatedAt: number;
  createdAt: number;
  murzBankPostId: string;
  userId: string;
  feedScratchesCount: number;
  teaContent: string;
  teaTitle: string;
}

interface PspsData {
  props: {
    pageProps: {
      posts: PspsPostItem[];
    };
  };
}

export { PspsData, PspsPostItem };
