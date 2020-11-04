const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
// const filteredByGender = document.querySelector('#filtered-by-gender')
const mode = document.querySelector('#mode')
const home = document.querySelector('#home')
const guidePerPage = 15
let guides = JSON.parse(localStorage.getItem('favoriteGuides'))
let filtered = []
let displayMode = "card"


// function

// renderGuideList的HTML
function renderGuideByCardMode(data) {
  if (data.length === 0) {
    dataPanel.innerHTML = `<h5 class="text-center mt-5">Please go to home page and find your own tour guide!</h5>`
  } else {
    let htmlContent = '<div class= "row d-flex justify-content-center">'
    data.forEach((item) => {
      htmlContent += `
        <div class="col-sm-4 col-md-4 col-lg-3 mt-3 mx-2 d-flex flex-column card">
           <img src="${item.avatar}" class="card-img-top btn mt-3 btn-show-guide card-avatar" alt="${item.id}" 
            type="button" data-toggle="modal" data-target="#guide-modal" data-id="${item.id}">
           <div class="card-body">
           <h5 class="card-title text-center name">${item.name} ${item.surname}</h5>
           <h6 class="card-body text-center region"><i class="far fa-flag"></i> ${item.region}</h6>
           <div class="text-center"><button class="btn btn-danger btn-sm delete-favorite" data-id="${item.id}">Ｘ</button></div>
           </div>
        </div>
      `
    })
    htmlContent += `</div>`
    dataPanel.innerHTML = htmlContent
  }
}

// 將所有電影資料渲染在頁面上: list mode，非預設
function renderGuideByListMode(data) {
  if (data.length === 0) {
    dataPanel.innerHTML = `<h5 class="text-center mt-5">Please go to home page and find your own tour guide!</h5>`
  } else {
    let rawHTML = `    
    <table class="table">
      <thead>
        <tr>
          <th scope="col" class="text-center"></th>
          <th scope="col" class="text-center">Name</th>
          <th scope="col" class="text-center">Region</th>
          <th scope="col" class="text-center">Infomation</th>
          <th scope="col" class="text-center">Add to My Favorite</th>
        </tr>
      </thead>`
    data.forEach((item) => {
      rawHTML += `
      <tbody>
        <tr style="height:100px">
          <td><img src="${item.avatar}" class="card-img-top btn mt-3 btn-show-guide list-avatar d-flex align-items-center" alt="${item.id}" 
            type="button" data-toggle="modal" data-target="#guide-modal" data-id="${item.id}"></td> 
          <td class="vertical-middle">${item.name} ${item.surname}</td>
          <td class="vertical-middle">${item.region}</td>
          <td class="text-center"><button class="btn btn-primary btn-show-guide" data-toggle="modal"
                data-target="#guide-modal" data-id="${item.id}">More</td>
          <td class="text-center"><button class="btn btn-danger btn-sm delete-favorite" data-id="${item.id}">Ｘ</button></td>
        </tr>
      </tbody>
     `
    })
    rawHTML += `</table>`
    dataPanel.innerHTML = rawHTML
  }

}

// mode 轉換
function renderByMode(mode, page) {
  if (mode === "card") {
    renderGuideByCardMode(getGuidesByPage(page))
  } else if (mode === "list") {
    renderGuideByListMode(getGuidesByPage(page))
  }
}

// showGuideModal的HTML
function showGuideModal(id) {
  const guideTitle = document.querySelector('#guide-modal-title')
  const guideBody = document.querySelector('#guide-modal-body')

  //將前一位的modal資料清空
  guideTitle.innerHTML = ''
  guideBody.innerHTML = ''

  // 放入新一位的modal資料
  axios.get(INDEX_URL + id).then((response) => {
    const guideData = response.data
    guideTitle.innerHTML = `${guideData.name} ${guideData.surname}`
    guideBody.innerHTML = `
      <div class="col-4">
        <img class="modal-avatar pr-1 mt-4" src="${guideData.avatar}" alt="...">
      </div>
      <table class="modal-table table table-borderless table-sm col-8">
        <tbody>
          <tr>
            <th scope="row">Gender</th>
            <td>${guideData.gender}</td>
          </tr>
          <tr>
            <th scope="row">Age</th>
             <td>${guideData.age}</td>
          </tr>
          <tr>
            <th scope="row">Region</th>
            <td>${guideData.region}</td>            
          </tr>
          <tr>
            <th scope="row">Birthday</th>
            <td>${guideData.birthday}</td>
          </tr>
          <tr>
            <th scope="row">Email</th>
            <td>${guideData.email}</td>
          </tr>
        </tbody>
      </table>
    `
  })
}


function getGuidesByPage(page) {
  // if (!guides) {
  //   return null
  // } else {
  // 如果搜尋結果有東西，條件判斷為 true ，會回傳 filtered，然後用 data 保存回傳值，否則就還是取總清單 Guide
  const data = filtered.length ? filtered : guides
  // 計算起始 index 
  const startIndex = (page - 1) * guidePerPage
  // 回傳切割後的新陣列
  return data.slice(startIndex, startIndex + guidePerPage)
  // }
}


function renderPaginator(amount) {
  // 無條件進入，計算總頁數，共8頁
  const numberOfPages = Math.ceil(amount / guidePerPage)
  // 製作template ，改寫<li class="page-item"><a class="page-link" href="#">1</a></li>
  // 另外，也在每個a 標籤中，加上 data-page 屬性來標注頁數，方便後續取用頁碼。
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML

}

// 刪除 favorite
function deleteFavorite(id) {
  if (!guides) return
  let guideIndex = guides.findIndex((guide) => guide.id === id)
  // if (guideIndex === -1) {
  //   return
  // } else {
  guides.splice(guideIndex, 1)
  // return alert('已從清單中刪除')
  // }
  localStorage.setItem('favoriteGuides', JSON.stringify(guides))
  // renderGuideByCardMode(guides)
  renderByMode(displayMode, 1)
}




// listener

// 點擊照片會得到所點擊的照片 id 並呼叫showGuideModal
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-guide')) {
    showGuideModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.delete-favorite')) {
    deleteFavorite(Number(event.target.dataset.id))
  }
})


paginator.addEventListener('click', function onPaginatorClicked(event) {
  // 如果被點擊的不適a標籤，結束
  if (event.target.tagName !== "A") return
  // 透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  // 依當下的 mode 更新畫面
  renderByMode(displayMode, page)
})



// filteredByGender.addEventListener('click', function onFilterdByGenderClicked(event) {
//   if (event.target.matches('.filtered-by-male') || event.target.matches('.filtered-by-female')) {
//     if (event.target.matches('.filtered-by-male')) {
//       filtered = guides.filter((guide) => guide.gender == "male")
//     } else if (event.target.matches('.filtered-by-female')) {
//       filtered = guides.filter((guide) => guide.gender == "female")
//     }
//     renderPaginator(filtered.length)
//   } else {
//     filtered = []
//     searchInput.value = ''
//     renderPaginator(guides.length)
//   } renderByMode(displayMode, 1)
// })



mode.addEventListener('click', function onModeClicked(event) {
  if (event.target.matches('.fas.fa-th')) {
    displayMode = "card"
  } else if (event.target.matches('.fas.fa-bars')) {
    displayMode = "list"
  } renderByMode(displayMode, 1)
  //  在搜尋過程中如要轉換mode，分頁也會視data而更新
  const data = filtered.length ? filtered : guides
  renderPaginator(data.length)
})


renderByMode(displayMode, 1)