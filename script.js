const top250 = 'https://api.wmdb.tv/api/v1/top?type=Imdb&skip=0&limit=250&lang=Cn';
const searchApi = 'https://api.wmdb.tv/api/v1/movie/search?q=hello';
const form = document.getElementById('form');
const loading = document.querySelector('.loading-mask');


async function getMovies(url, isSearch) {
  loading.classList.remove('hideLoading');
  const res = await fetch(url).catch(() => {
    setMsg('服务器出故障了，请稍后重试', 'error');
    loading.classList.add('hideLoading');
  });
  if (res) {
    let result = await res.json();
    loading.classList.add('hideLoading');
    if (isSearch) {
      result = result.data;  
      setMsg('搜索成功！', 'success');
      
    }
    showMovies(result);
  }
}

getMovies(top250);

function showMovies(movies) {
  main.innerHTML = ''
  const mainContainer = document.querySelector('#main');
  movies.forEach(movie => {
    // console.log(movie);
    const { doubanRating, data } = movie;
    const movieEl = document.createElement('div')
    movieEl.classList.add('movie')
    movieEl.innerHTML = `
        <div class='img-container'>
          <img src=${data[0].poster} alt="">
        </div>
        <div class="movie-info">
          <h3>${data[0].name}</h3>
          <span class=${setColor(doubanRating)}>${doubanRating ? doubanRating : '0.0'}</span>
        </div>
        <div class="overview">
          <h3>概览</h3>
          <div class="text">
          ${data[0].description}
          </div>
        </div>   
         `
    mainContainer.appendChild(movieEl);
  })
}

function setColor(doubanRating) {
  const rating = parseFloat(doubanRating);
  if (rating >= 8) {
    return 'green';
  } else if (rating >= 6) {
    return 'orange';
  } else {
    return 'red'
  }
}


function searchMovie(e) {
  const searchWord = e.target[0].value;
  const url = `https://tcb-yb5as3yu04e4f7-1dp2p6ab20c9b.service.tcloudbase.com/api?query=${encodeURIComponent(searchWord)}`;
  // getMovies(url);
  getMovies(url, true);
}

function throttle(fn, time, msg) {
  let start = 0;
  return function (e) {
    const timeSpan = Date.now() - start;
    if (timeSpan < time) {
      setMsg(msg, 'error');
    } else {
      start = Date.now();
      fn.call(this, e);
    }
  }
}

const throttleSearch = throttle(searchMovie, 30000,'抱歉，30s内仅仅能搜索一次！');


form.addEventListener('submit', function (e) {
  e.preventDefault();
  throttleSearch(e);
});


// 消息设置
const msgContainer = document.querySelector('.message');

function setMsg(text, type) {
  if (!text) return;
  const p = document.createElement('p');
  p.textContent = text;
  if (type === 'success') {
    p.classList.add('success');
  } else {
    p.classList.add('error');
  }
  msgContainer.appendChild(p);
  setTimeout(() => {
    p.remove();
  }, 5000);
}


// 点击logo
const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
  window.location.reload()
})