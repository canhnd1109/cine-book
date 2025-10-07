import { AuthService } from '~/services/auth.service'
import { GenreService } from './genre.service'
import { SharedService } from './shared.service'

const apiAuth: AuthService = new AuthService()
const apiGenre: GenreService = new GenreService()
const apiShared: SharedService = new SharedService()

export { apiAuth, apiGenre, apiShared }
