import { httpApi } from './http.api'
import { PostModel } from '../models/post.model'
import { ProfileModel } from '../models/profile.model'
import { ArticleModel } from '../models/article.model'


export interface searchResponse {
  success: boolean
  message: string
  data: {
    posts: Array<PostModel>
    articles: Array<ArticleModel>
    users: Array<ProfileModel>
  }
}


export const search = (search: string): Promise<searchResponse> =>
  httpApi.get<searchResponse>(`search?q=${search}`).then(({ data }) => data)