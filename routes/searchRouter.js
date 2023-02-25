import { Router } from "express";
import { search } from "../models/search.js"

export const searchRouter = Router();

searchRouter.get('/', async function (req, res) {
    /*
    * order (string)
    * - date – 리소스를 만든 날짜를 기준으로 최근 항목부터 시간 순서대로 리소스를 정렬합니다.
    * - rating – 높은 평가부터 낮은 평가순으로 리소스를 정렬합니다.
    * - relevance – 검색 쿼리에 대한 관련성을 기준으로 리소스를 정렬합니다. 이 매개변수의 기본값입니다.
    * - title – 제목에 따라 문자순으로 리소스를 정렬합니다.
    * - videoCount – 업로드한 동영상 수에 따라 채널을 내림차순으로 정렬합니다.
    * - viewCount – 리소스를 조회수가 높은 항목부터 정렬합니다
    * */
    const q = req.query.keyword ? req.query.keyword : '';
    const pageToken = req.query.pageToken ? req.query.pageToken : '';
    const maxResults = req.query.maxResults ? parseInt(req.query.maxResults) : 50;
    const order = req.query.order ? req.query.order : 'relevance';

    // const apiKey8kwchoi8 = "AIzaSyATfbBAAtH_yJSVms7MqEVue7SkD9RLtcU";
    // const apiKeyChoiCaleb0103 = "AIzaSyABnK6fuZe-SGvWNXci8XLFBySxIDaV9MY";
    // const apiKeyKunwooChoi0103 = "AIzaSyCzfA9emuVddIxhnce9IJqAw_UgdKhfMCU"
    // const apiKeyEtcSeoulImg = "AIzaSyC7X43YOEnMFsiigY5zfshw58C8_4z0b7s";
    const apiKeyCaleb = "AIzaSyDRObKiCl0KYKQdeLNcCSm8ZaVm2B4lQ3c";

    const result = await search(apiKeyCaleb, q, pageToken, maxResults, order);

    if (result.success) {
        return res.status(200).json(result)
    } else {
        return res.status(result.status).json(result)
    }
});