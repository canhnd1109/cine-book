export interface IMovieFilter {
  // {1}. Sắp xếp theo thời gian khởi chiếu
  // {2}. Sắp xếp theo giá vé
  // {3}. Sắp xếp theo tên
  // {4}. Sắp xếp theo số lượt xem
  // {5}. Sắp xếp theo lượt thời lượng chiếu
  searchName: string
  orderBy: '1' | '2' | '3' | '4' | '5' | ''
  genre: string
  minPrice: string | number
  maxPrice: string | number
  rangePrice: string | number
  pageIndex: number
  pageSize: number
  orderType: string
}

export interface IMovie {
  id: string
  name: string
  description: string
  director: string
  performer: string
  releaseDate: string
  closeDate: string
  nation: string
  duration: number
  note: string
  price: number
  trailerUrl: string
  posterUrl: string
  genres: string[]
}

export interface IMovieByDay extends IMovie {
  showtimeDetailResponses: IShowtimeDetailByDay[]
}

export interface IShowtimeDetailByDay {
  id: string
  date: string
  startTime: string
  endTime: string
  roomResponse: null
}

// Response structure cho API cinema movies by date
export interface ICinemaMoviesByDate {
  cinemaId: string
  cinemaName: string
  address: string
  dates: IDateMovies[]
}

export interface IDateMovies {
  date: string
  movies: IMovieWithShowtimes[]
}

export interface IMovieWithShowtimes {
  movieId: string
  movieName: string
  posterUrl: string
  duration: number
  genres: string[]
  showtimes: IShowtime[]
}

export interface IShowtime {
  showtimeId: string
  startTime: string
  endTime: string
  roomName: string
}

//  "cinemaId": "2d5cfb97-fd57-40e8-a495-1cb5de620a52",
//     "cinemaName": "sfsdfds",
//     "address": "sdfsd ,4 ,1",
//     "dates": [
//       {
//         "date": "2025-11-13",
//         "movies": [
//           {
//             "movieId": "86c7518b-13c3-494c-ad22-bf4383e2f989",
//             "movieName": "SDGFSDFG",
//             "posterUrl": "http://res.cloudinary.com/dytxoysey/image/upload/v1760348673/jnhi4vmjxcuxjsxfjbt7.jpg",
//             "duration": 123,
//             "genres": [
//               "Kiếm hiệp"
//             ],
//             "showtimes": [
//               {
//                 "showtimeId": "7611177c-6f16-4069-b02e-46049505e08a",
//                 "startTime": "15:51",
//                 "endTime": "18:24",
//                 "roomName": "Phong 1"
//               }
//             ]
//           },
//           {
//             "movieId": "2992cf6c-b0cf-43cf-9b25-625cf31a6948",
//             "movieName": "asdasd",
//             "posterUrl": "http://res.cloudinary.com/dytxoysey/image/upload/v1760348959/jnup9ntgvtegfikl4c8u.jpg",
//             "duration": 123,
//             "genres": [
//               "Kiếm hiệp"
//             ],
//             "showtimes": [
//               {
//                 "showtimeId": "fa0526ed-b881-4a5d-9566-8482b59d9256",
//                 "startTime": "23:08",
//                 "endTime": "01:41",
//                 "roomName": "Phong 1"
//               }
//             ]
//           },
//           {
//             "movieId": "5dbee78c-5e15-4ad3-9993-c62e19c4f99d",
//             "movieName": "sdgsdg",
//             "posterUrl": "http://res.cloudinary.com/dytxoysey/image/upload/v1759833024/q26hezjlpbige53mhhdt.webp",
//             "duration": 123,
//             "genres": [
//               "Kiếm hiệp"
//             ],
//             "showtimes": [
//               {
//                 "showtimeId": "8fa7c261-271f-4bb8-aca0-f7a7f8237057",
//                 "startTime": "23:07",
//                 "endTime": "01:40",
//                 "roomName": "Phong "
//               }
//             ]
//           },
//           {
//             "movieId": "99dfe3d8-6f1f-4b17-807c-f557744a2ed7",
//             "movieName": "sfsd",
//             "posterUrl": "http://res.cloudinary.com/dytxoysey/image/upload/v1762930723/mmbokpd9tjmrjd35jj8p.png",
//             "duration": 232,
//             "genres": [
//               "Kiếm hiệp"
//             ],
//             "showtimes": [
//               {
//                 "showtimeId": "ffd8f36c-50d0-40eb-84e5-4a6e117f66bb",
//                 "startTime": "01:08",
//                 "endTime": "05:30",
//                 "roomName": "Phong 1"
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "date": "2025-11-15",
//         "movies": [
//           {
//             "movieId": "86c7518b-13c3-494c-ad22-bf4383e2f989",
//             "movieName": "SDGFSDFG",
//             "posterUrl": "http://res.cloudinary.com/dytxoysey/image/upload/v1760348673/jnhi4vmjxcuxjsxfjbt7.jpg",
//             "duration": 123,
//             "genres": [
//               "Kiếm hiệp"
//             ],
//             "showtimes": [
//               {
//                 "showtimeId": "726901b2-988a-46c1-b010-9774901fe790",
//                 "startTime": "18:57",
//                 "endTime": "21:30",
//                 "roomName": "Phong 1"
//               },
//               {
//                 "showtimeId": "1160552b-8422-41e8-b631-33ae4ffca452",
//                 "startTime": "20:56",
//                 "endTime": "23:29",
//                 "roomName": "Phong "
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
