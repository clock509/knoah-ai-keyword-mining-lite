import fetch from "node-fetch";

const getVideoInformation = async (apiKey, videoIds) => fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics&id=${videoIds}&maxResults=50`,
    { method: 'GET'}
)
    .then((response) => response.json())
    .then(data => {
        return data.items;
    })
    .catch(error => {
        console.log('getVideoInformation error: ', error)
        return "조회수 확인 불가"
    });

const getChannelInformation = async (apiKey, channelIds) => fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&part=statistics&id=${channelIds}&maxResults=50`,
        { method: 'GET'}
    )
        .then((response) => response.json())
        .then(data => {
            return data.items;
        })
        .catch(error => {
            console.log('getChannelInformation error: ', error)
            return "구독자수 확인 불가"
        });

const searchChannels = async (apiKey, part, type, q, pageToken, maxResults, order) => fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=${part}&type=${type}&q=${q}&pageToken=${pageToken}&maxResults=${maxResults}&order=${order}&regionCode=KR`,
    { method: 'GET'}
)
    .then((response) => { return response })
    .catch((error) => console.log('error: ', error));


export const search = async (apiKey, q, pageToken, maxResults, order) => {
    const part = "snippet";
    const type = "video";
    const searchedChannels = await searchChannels(apiKey, part, type, q, pageToken, maxResults, order);
    const response = await searchedChannels.json();

    if (!searchedChannels.ok) {
        const status = searchedChannels.status;
        let message = '';
        if (status === 403) {
            message = "Server Error: 일일 조회 한도 초과로 인해 채널 검색에 실패했습니다. 고객센터에 문의해 주세요."
        } else {
            message = "Server Error: 알 수 없는 서버 에러로 채널 검색에 실패했습니다. 계속 발생할 시, 고객센터에 문의해 주세요."
        }

        const result = {
            success: false,
            status: status,
            message: message,
            errors: response.error.errors,
            code: response.error.code,
            errorMessage: response.error.message
        }
        return result;
    }

    const prevPageToken = response.prevPageToken ? response.prevPageToken : null;
    const nextPageToken = response.nextPageToken ? response.nextPageToken : null;
    const totalResults = response.pageInfo.totalResults;

    const channels = response.items.map(channel => ({
        id: channel.id,
        channelId: channel.snippet.channelId,
        publishedAt: channel.snippet.publishedAt.replace('T', ' ').replace('Z', ''),
        title: channel.snippet.title,
        channelTitle: channel.snippet.channelTitle,
        thumbnails: channel.snippet.thumbnails,
    }));

    // 키워드 검색 결과가 0 건이면 조회수, 구독자수를 조회할 수 없으므로 리턴.
    if (channels.length === 0) {
        return {
            success: true,
            prevPageToken: prevPageToken,
            nextPageToken: nextPageToken,
            searchResult: channels,
            totalResults: totalResults,
        }
    }

    let videoIds = [];
    let channelIds = [];
    channels.map(channel => {
        videoIds.push(channel.id.videoId)
        channelIds.push(channel.channelId)
    })

    const videoIdQueryString = videoIds.join("&id=");
    let videoInformationObject = {};
    const videoInformation = await getVideoInformation(apiKey, videoIdQueryString);

    const channelIdQueryString = channelIds.join("&id=");
    let channelInformationObject = {};
    const channelInformation = await getChannelInformation(apiKey, channelIdQueryString);


    videoInformation.map(video => {
        videoInformationObject[video.id] = video.statistics;
    })
    channelInformation.map(channel => {
        channelInformationObject[channel.id] = channel.statistics;
    })

    channels.map((channel, index) => {
        channel.videoViewCount = videoInformationObject[channel.id.videoId].viewCount
            ? parseInt(videoInformationObject[channel.id.videoId].viewCount).toLocaleString() // To add commas to number
            : "해당사항 없음";
        channel.subscriberCount = channelInformationObject[channel.channelId].subscriberCount
            ? parseInt(channelInformationObject[channel.channelId].subscriberCount).toLocaleString()
            : "해당사항 없음";
    })

    return {
        success: true,
        prevPageToken: prevPageToken,
        nextPageToken: nextPageToken,
        searchResult: channels,
        totalResults: totalResults,
    }
}