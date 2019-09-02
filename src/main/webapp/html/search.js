var pageNo = 1,
    pageSize = 10,
    param = location.href.split('?')[1],
    keyword = param.split('=')[1],
    bowList = $('.bow-list'),
    tbody = $('tbody'),
    prevPageLi = $('#prevPage'),
    nextPageLi = $('#nextPage'),
    currSpan = $('#currPage > span'),
    templateSrc = $('#tr-template').html(); // script 태그에서 템플릿 데이터를 꺼낸다.

//Handlebars를 통해 템플릿 데이터를 가지고 최종 결과를 생성할 함수를 준비한다.
var trGenerator = Handlebars.compile(templateSrc);


// JSON 형식의 데이터 목록 가져오기
function loadList(pn, keyword) {
  
  $.getJSON('../../bowtech/app/board/list?pageNo=' + pn +
      '&pageSize=' + pageSize + '&keyword=' + keyword, 
    function(obj) {
      
      if (obj.status == 'fail') {
        if (bowList.children('div')) {
          bowList.children('div').remove();
        }
        bowList.append('<div class="text-center"><span style="font-size:18px">검색 결과가 없습니다!!</span></tr>');
        prevPageLi.addClass('disabled');
        nextPageLi.addClass('disabled');
        return false;
      }
      
      pageNo = obj.pageNo;
    
      // TR 태그를 생성하여 테이블 데이터를 갱신한다.
      tbody.html(''); // 이전에 출력한 내용을 제거한다.

      var board = obj;
      
      // row의 제목 길이 제한 및 날짜에서 시간을 뺀다.
      board.list.forEach(function(item){
        
        if (item.title.length > 20) {
          item.title = item.title.substring(0,20) + '...';
        }
        item.createdDate = item.createdDate.substring(0,10);
      });
      
      // 템플릿 엔진을 실행하여 tr 태그 목록을 생성한다. 그리고 바로 tbody에 붙인다.
      $(trGenerator(board)).appendTo(tbody);
      
      // 현재 페이지의 번호를 갱신한다.
      currSpan.html(String(pageNo));
   
      // 1페이지일 경우 버튼을 비활성화 한다.
      if (pageNo <= 1) {
        prevPageLi.addClass('disabled');
      } else {
        prevPageLi.removeClass('disabled');
      } 
     
      // 마지막 페이지일 경우 버튼을 비활성화 한다.
      if (pageNo >= obj.totalPage) {
        nextPageLi.addClass('disabled');
      } else {
        nextPageLi.removeClass('disabled');
      }
      
      // 데이터 로딩이 완료되면 body 태그에 이벤트를 전송한다.
      $(document.body).trigger('loaded-list');
      
    }); // getJSON()
  
} // loadList()

// 이전, 다음 버튼 클릭 이벤트
$('#prevPage > a').click((e) => {
  e.preventDefault();
  loadList(pageNo - 1, keyword);
});

$('#nextPage > a').click((e) => {
  e.preventDefault();
  loadList(pageNo + 1, keyword);
});

//검색 버튼 클릭이벤트
$('#search-btn').click(function() {
  searchResult($(this).siblings('input[type="text"]'));
});

// 검색 엔터 이벤트
$("#search-form").children('input[type="text"]').keydown(function(key) {
  if (key.which == 13) {
    searchResult($(this));
  }
});

function searchResult(obj) {
  if (obj.val().length < 1) {
    alert('키워드를 입력하세요!');
    return false;
  }
  pageNo = 1;
  keyword = obj.val();
  window.location.href = 'search.html?keyword=' + keyword;
}

// 페이지를 출력한 후 1페이지 목록을 로딩한다.
loadList(pageNo, keyword);

// 테이블 목록 가져오기를 완료했으면 제목 a 태그에 클릭 리스너를 등록한다. 
$(document.body).bind('loaded-list', () => {
  // 제목을 클릭했을 때 view.html로 전환시키기
  $('.bow-view-link').click((e) => {
    e.preventDefault();
    window.location.href = 'view.html?no=' + 
      $(e.target).attr('data-no');
  });
});







