import { AuthService } from '~/services/auth.service'
import { GenreService } from './genre.service'
import { SharedService } from './shared.service'
import { MovieService } from './movie.service'
import { PublicService } from './public.service'
import { CinemaService } from './cinema.service'
import { RoomService } from './room.service'
import { ShowtimeService } from './showtime.service'

const apiAuth: AuthService = new AuthService()
const apiGenre: GenreService = new GenreService()
const apiShared: SharedService = new SharedService()
const apiMovie: MovieService = new MovieService()
const apiPublic: PublicService = new PublicService()
const apiCinema: CinemaService = new CinemaService()
const apiRoom: RoomService = new RoomService()
const apiShowtime: ShowtimeService = new ShowtimeService()

export { apiAuth, apiGenre, apiShared, apiMovie, apiPublic, apiCinema, apiRoom, apiShowtime }
