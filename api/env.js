//SON VISIBLES EN https://portfolio-course-js-front.vercel.app/api/env cuando usamos la version scriptVercel.js
export default function handler(req, res) {
    res.status(200).json({
        PUBLIC_KEY: process.env.PUBLIC_KEY,
        ID_TEMPLATE: process.env.ID_TEMPLATE,
        ID_SERVICE: process.env.ID_SERVICE
    });
}
