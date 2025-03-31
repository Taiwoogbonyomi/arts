import { rest } from "msw"
const baseURL = 'https://art-drf-api-f47791898f85.herokuapp.com/'


export const handlers = [
    rest.get(`$(baseURL)dj-rest-auth/user/`, (req,res,ctx) => {
        return res (ctx.json({
            pk: 3,
            username: "Jaden",
            email: "",
            first_name: "",
            last_name: "",
            profile_id: 3,
            profile_image: "https://res.cloudinary.com/dkhjkexll/image/upload/v1/media/../default_profile_uo01l5"
        }));
    }),
    rest.post(`$(baseURL)dj-rest-auth/logout/`, (req,res,ctx) => {
        return res(ctx,status(200));
    })
]