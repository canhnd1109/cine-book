import { AuthService } from '~/services/auth.service'
import { GenreService } from './genre.service'
import { SharedService } from './shared.service'
import { MovieService } from './movie.service'

const apiAuth: AuthService = new AuthService()
const apiGenre: GenreService = new GenreService()
const apiShared: SharedService = new SharedService()
const apiMovie: MovieService = new MovieService()

export { apiAuth, apiGenre, apiShared, apiMovie }
