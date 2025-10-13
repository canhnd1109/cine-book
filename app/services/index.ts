import { AuthService } from '~/services/auth.service'
import { GenreService } from './genre.service'
import { SharedService } from './shared.service'
import { MovieService } from './movie.service'
import { PublicService } from './public.service'
import { CinemaService } from './cinema.service'

const apiAuth: AuthService = new AuthService()
const apiGenre: GenreService = new GenreService()
const apiShared: SharedService = new SharedService()
const apiMovie: MovieService = new MovieService()
const apiPublic: PublicService = new PublicService()
const apiCinema: CinemaService = new CinemaService()

export { apiAuth, apiGenre, apiShared, apiMovie, apiPublic, apiCinema }
