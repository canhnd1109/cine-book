import { AuthService } from '~/services/auth.service'
import { GenreService } from './genre.service'

const apiAuth: AuthService = new AuthService()
const apiGenre: GenreService = new GenreService()

export { apiAuth, apiGenre }
