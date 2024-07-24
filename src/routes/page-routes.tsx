import React, { ReactElement } from "react";
import { ROUTES } from "./route-path";
import {
  HomePage,
  ProfilePage,
  UserProfilePage,
  PostPage,
  EditPostPage,
  NewPostPage,
  SearchPostPage,
  StartupsPage,
  PlatformDetailPage,
  PlatformsPage,
  StartupDetailPage,
  ArticlePage,
  NewArticlePage,
  ArticleDetailPage,
  EditArticlePage,
  SearchArticlePage,
  PrivateChatRoomPage,
} from "../pages";
import MobileChatPage from "../pages/chat/mobile/mobileChatPage";
import MobileRoom from "../pages/chat/mobile/room/mobileRoom";

export const PAGE_ROUTES: {
  id: number;
  isPrivate: boolean;
  prevent: boolean;
  deactivate: boolean;
  path: string;
  element: ReactElement;
}[] = [
  {
    id: 1,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.INDEX,
    element: <HomePage />,
  },
  {
    id: 2,
    isPrivate: true,
    prevent: false,
    deactivate: false,
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
  },
  {
    id: 3,
    isPrivate: true,
    prevent: false,
    deactivate: false,
    path: ROUTES.POSTS_NEW,
    element: <NewPostPage />,
  },
  {
    id: 4,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.POSTS_DETAILS,
    element: <PostPage />,
  },
  {
    id: 5,
    isPrivate: true,
    prevent: false,
    deactivate: false,
    path: ROUTES.POSTS_EDIT,
    element: <EditPostPage />,
  },
  {
    id: 6,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.USER_PROFILE,
    element: <UserProfilePage />,
  },
  {
    id: 7,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.POSTS_SEARCH,
    element: <SearchPostPage />,
  },
  {
    id: 8,
    isPrivate: true,
    prevent: false,
    deactivate: false,
    path: ROUTES.PRIVATE_CHAT_ROOM,
    element: <PrivateChatRoomPage />,
  },
  {
    id: 9,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.ARTICLES_PAGE,
    element: <ArticlePage />,
  },
  {
    id: 10,
    isPrivate: true,
    prevent: false,
    deactivate: false,
    path: ROUTES.ARTICLES_NEW,
    element: <NewArticlePage />,
  },
  {
    id: 11,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.ARTICLES_DETAIL,
    element: <ArticleDetailPage />,
  },
  {
    id: 12,
    isPrivate: true,
    prevent: false,
    deactivate: false,
    path: ROUTES.ARTICLES_EDIT,
    element: <EditArticlePage />,
  },
  {
    id: 13,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.ARTICLES_SEARCH,
    element: <SearchArticlePage />,
  },
  {
    id: 14,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.PLATFORMS,
    element: <PlatformsPage />,
  },
  {
    id: 15,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.PLATFORM_PAGE,
    element: <PlatformDetailPage />,
  },
  {
    id: 16,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.STARTUPS,
    element: <StartupsPage />,
  },
  {
    id: 17,
    isPrivate: false,
    prevent: false,
    deactivate: false,
    path: ROUTES.STARTUP_PAGE,
    element: <StartupDetailPage />,
  },
  {
    id: 18,
    isPrivate: true,
    prevent: false,
    deactivate: false,
    path: ROUTES.PRIVATE_MOBILE_CHAT,
    element: <MobileChatPage />,
  },
  {
    id: 19,
    isPrivate: true,
    prevent: false,
    deactivate: false,
    path: ROUTES.PRIVATE_MOBILE_NEW_ROOM,
    element: <MobileRoom />,
  },
];
