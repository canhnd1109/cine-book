import { AuthService } from '~/services/auth.service'
import { GenreService } from './genre.service'
import { SharedService } from './shared.service'
import { MovieService } from './movie.service'
import { PublicService } from './public.service'

const apiAuth: AuthService = new AuthService()
const apiGenre: GenreService = new GenreService()
const apiShared: SharedService = new SharedService()
const apiMovie: MovieService = new MovieService()
const apiPublic: PublicService = new PublicService()

export { apiAuth, apiGenre, apiShared, apiMovie, apiPublic }
