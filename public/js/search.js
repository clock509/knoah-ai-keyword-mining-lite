let prevPageToken = '';
let nextPageToken = '';
let keyword = '';
let totalResults = 0;
let currentDataList = [];


const search = async (prevPageToken, nextPageToken, keyword) => {
    return await fetch(
        `http://localhost:3000/api/search?keyword=${keyword}&pageToken=${nextPageToken}`
    )
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {return error});
}

const addSearchResultTable = async() => {
    // 데이터 최대 출력 건 수(600건)에 도달한 경우, 검색 API 호출을 막아야 함.
    if (currentDataList.length >= 600) {
        setShowMoreButtonVisibility("hidden")
        return
    }

    // 전체 검색결과 갯수만큼 데이터를 모두 조회한 경우, 검색 API 호출을 막아야 함.
    if (totalResults > 0 && currentDataList.length >= totalResults) {
        setShowMoreButtonVisibility("hidden")
        return
    }

    keyword = document.getElementById("keyword-input") ? document.getElementById("keyword-input").value : null;
    const tableData = await search(prevPageToken, nextPageToken, keyword);
    const tableBody = document.getElementById('searchedListTableBody');

    if (tableData.success) {
        totalResults = tableData.totalResults;
        const searchResult = tableData.searchResult;
        currentDataList = [...currentDataList, ...searchResult];
        nextPageToken = tableData.nextPageToken;
        prevPageToken = tableData.prevPageToken;

        // 검색 첫 페이지일 때는 검색 API를 호출할 가능성을 열어둬야 한다.
        if (!prevPageToken && nextPageToken) { setShowMoreButtonVisibility("visible") }

        if (totalResults > 0) {
            // 마지막 페이지에 도달한 경우, 검색 API 호출을 막아야 함.
            if (!nextPageToken) { setShowMoreButtonVisibility("hidden") }

            searchResult.map(data => {
                const thumbnail = data.thumbnails.medium;
                const title = data.title;
                const videoViewCount = data.videoViewCount ? data.videoViewCount : "해당사항 없음";
                const subscriberCount = data.subscriberCount ? `${data.subscriberCount.toString()}명` : "해당사항 없음";
                const channelTitle = data.channelTitle;
                const publishedAt = data.publishedAt.split(' ')[0].split('-').join('.').substring(2);

                // tbody에 넣을 tr 1개, td 6개 생성
                const tr = document.createElement('tr');

                const tdImg = document.createElement('td');
                const img = document.createElement('img');
                img.src = thumbnail.url;
                tdImg.appendChild(img);

                const tdTitle = document.createElement('td');
                const divTitle = document.createElement('div');
                divTitle.innerHTML = title;
                tdTitle.appendChild(divTitle);

                const tdVideoViewCount = document.createElement('td');
                const divVideoViewCount = document.createElement('div');
                divVideoViewCount.innerHTML = videoViewCount;
                tdVideoViewCount.appendChild(divVideoViewCount);

                const tdSubscriberCount = document.createElement('td');
                const divSubscriberCount = document.createElement('div');
                divSubscriberCount.innerHTML = subscriberCount;
                tdSubscriberCount.appendChild(divSubscriberCount);

                const tdChannelTitle = document.createElement('td');
                const divChannelTitle = document.createElement('div');
                divChannelTitle.innerHTML = channelTitle;
                tdChannelTitle.appendChild(divChannelTitle);

                const tdPublishedAt = document.createElement('td');
                const divPublishedAt = document.createElement('div');
                divPublishedAt.innerHTML = publishedAt;
                tdPublishedAt.appendChild(divPublishedAt);

                tr.appendChild(tdImg);
                tr.appendChild(tdTitle);
                tr.appendChild(tdVideoViewCount);
                tr.appendChild(tdSubscriberCount);
                tr.appendChild(tdChannelTitle);
                tr.appendChild(tdPublishedAt);

                tr.className = "tableData";
                tableBody.appendChild(tr);
            })
        } else {
            // 검색한 결과가 없는 경우(= prevPageToken = null), 아래를 보여준다.
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            const div = document.createElement('div');

            div.setAttribute("style", "padding: 64px");
            div.innerHTML = "<h2>검색결과가 없습니다.</h2> <br><br>다른 키워드 검색을 시도해 보거나 필터를 수정하세요."

            td.colSpan = 6;
            td.setAttribute("style", "text-align: center");
            td.appendChild(div);
            tr.appendChild(td);

            tr.className = "tableData";
            tableBody.appendChild(tr);
        }
    } else {
        // do nothing
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const div = document.createElement('div');

        div.setAttribute("style", "padding: 64px");
        div.innerHTML = "<h2>검색결과가 없습니다.</h2> <br><br>다른 키워드 검색을 시도해 보거나 필터를 수정하세요."

        td.colSpan = 6;
        td.setAttribute("style", "text-align: center");
        td.appendChild(div);
        tr.appendChild(td);

        tr.className = "tableData";
        tableBody.appendChild(tr);

        alert(tableData.message);
    }
}

const showKeywordConfirmModal = async () => {
    keyword = document.getElementById("keyword-input").value;
    if (keyword === "" || !keyword) {
        alert("검색할 키워드를 입력해 주세요.")
        return
    }

    let keywordConfirmModalText = document.getElementById("keywordConfirmModalText");
    keywordConfirmModalText.innerHTML = `키워드<br> '${keyword}' (으)로 <br>검색하시겠어요?`;
    const keywordConfirmModal = document.getElementById("keywordConfirmModal");
    keywordConfirmModal.style.display = "flex"; // 중앙 정렬
}

const onClickShowMoreButton = async () => {
    await addSearchResultTable(prevPageToken, nextPageToken, keyword);
}

const setShowMoreButtonVisibility = (status) => {
    let showMoreButton = document.getElementById("showMoreButton");
    showMoreButton.style.visibility = status;
}

const onClickConfirmSearchButton = async () => {
    const keywordConfirmModal = document.getElementById("keywordConfirmModal");
    keywordConfirmModal.style.display = "none";
    keyword = document.getElementById("keyword-input").value;

    // 검색을 새로이 실행하므로, 내용이 초기화된 테이블로 교체한다.
    let currentTbody = document.getElementById("searchedListTableBody");
    let newTbody = document.createElement('tbody');
    newTbody.id = 'searchedListTableBody';
    currentTbody.parentNode.replaceChild(newTbody, currentTbody);

    prevPageToken = '';
    nextPageToken = '';
    totalResults = 0;
    currentDataList = [];

    await addSearchResultTable(prevPageToken, nextPageToken, keyword);
}

const onClickCancelSearchButton = () => {
    const keywordConfirmModal = document.getElementById("keywordConfirmModal");
    keywordConfirmModal.style.display = "none";
}