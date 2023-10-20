"use strict";

// 더미데이터
let listObj = [
  {
    id: 0,
    value: 75,
  },
  {
    id: 1,
    value: 20,
  },
  {
    id: 2,
    value: 80,
  },
  {
    id: 3,
    value: 100,
  },
  {
    id: 4,
    value: 70,
  },
];
const graph = document.getElementById("graph-box"); // 1. 그래프
const table = document.getElementById("value-table"); // 3. 값 편집 - 테이블
const json = document.getElementById("json-box"); // 4. 값 고급 편집 - JSON
let btnAdded = false; // 초기로딩시 버튼 생성용

/** input 생성 factory function */
const createInput = (type = "text", value = "내용", className) => {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  if (className) {
    input.classList.add(className);
  }
  return input;
};

/** element에 button 생성 factory function */
const addBtnToElement = (element, value = "btn", className, clickHandler) => {
  const parentElement = element.parentElement; // 상위 객체 찾기
  const btn = createInput("button", value, className);
  parentElement.appendChild(btn);
  if (clickHandler) {
    btn.addEventListener("click", clickHandler);
  }
};

/** 그래프 업데이트 function */
const updateGraph = (listObj) => {
  const svgNS = "http://www.w3.org/2000/svg"; // SVG 네임스페이스
  const space = 50; // 여백 설정

  // 너비, 높이 가져오기
  const width = graph.clientWidth; // 그래프 너비 가져오기
  const height = graph.clientHeight; // 그래프 높이 가져오기

  // 모든 자식 요소 삭제
  while (graph.firstChild) {
    graph.removeChild(graph.firstChild);
  }

  // 그래프 배경 색상 지정
  // const graphBg = document.createElementNS(svgNS, "rect");
  // graphBg.setAttribute("width", "100%"); // 배경 너비(전체)
  // graphBg.setAttribute("height", "100%"); // 배경 높이(전체)
  // graphBg.setAttribute("fill", "#e9e9e9"); // 배경색상 - var(--grey-light-color)와 같음
  // graph.appendChild(graphBg);

  // X축 생성
  const axisX = document.createElementNS(svgNS, "line");
  axisX.setAttribute("x1", space); // 왼쪽 꼭지점 x
  axisX.setAttribute("y1", height - space); // 왼쪽 꼭지점 y
  axisX.setAttribute("x2", width - space / 2); // 오른쪽 꼭지점 x
  axisX.setAttribute("y2", height - space); // 오른쪽 꼭지점 y
  axisX.classList.add("graph-axis");
  graph.appendChild(axisX);

  // Y축 생성
  const axisY = document.createElementNS(svgNS, "line");
  axisY.setAttribute("x1", space); // 상단 꼭지점 x
  axisY.setAttribute("y1", space / 2); // 상단 꼭지점 y
  axisY.setAttribute("x2", space); // 하단 꼭지점 x
  axisY.setAttribute("y2", height - space); // 하단 꼭지점 y
  axisY.classList.add("graph-axis");
  graph.appendChild(axisY);

  // 0점 생성
  const textZero = document.createElementNS(svgNS, "text");
  textZero.setAttribute("x", space / 2); // 꼭지점 x
  textZero.setAttribute("y", height - space); // 꼭지점 y
  textZero.textContent = "0";
  graph.appendChild(textZero);

  // 그래프 영역 생성 및 필요한 값 설정
  let maxValue = Math.max(...listObj.map((obj) => obj.value)); // value 중 가장 큰 값 탐색
  maxValue = maxValue > 100 ? maxValue : 100; // 100보다 작으면 100을 제일 큰 값으로 설정
  const contentWidth = (width - space * 1.5) / listObj.length; // 그래프 영역 너비
  const contentHeight = height - space * 1.5; // 그래프 영역 높이
  const barWidth = contentWidth / 5; // 막대 너비
  const barPerHeight = contentHeight / maxValue; // 값 1 당 높이 길이

  // 그래프 영역 막대 그리기
  listObj.map((obj, i) => {
    const bar = document.createElementNS(svgNS, "rect");
    const barHeight = barPerHeight * obj.value; // 막대 높이 계산
    const barX = contentWidth * i + contentWidth / 2 + space - barWidth / 2; // 막대 x위치 계산
    const barY = contentHeight - barHeight + space / 2; // 막대 y위치 계산
    bar.setAttribute("x", barX); // 막대 x 꼭지점
    bar.setAttribute("y", barY); // 막대 y 꼭지점
    bar.setAttribute("width", barWidth); // 막대 너비
    bar.setAttribute("height", barHeight); // 막대 높이
    bar.classList.add("graph-bar");
    graph.appendChild(bar);

    // 그래프 X축 레이블 생성
    const textX = document.createElementNS(svgNS, "text");
    textX.setAttribute("x", barX + barWidth / 2 - 5); // 레이블 x 꼭지점
    textX.setAttribute("y", height - space / 2); // 레이블 y 꼭지점
    textX.textContent = obj.id; // id 값으로 레이블 생성
    graph.appendChild(textX);
  });

  // 최댓값 기준점 생성(100이하면 100으로 생성)
  const textMark = document.createElementNS(svgNS, "text");
  textMark.setAttribute("x", space * 0.2); // 꼭지점 x
  textMark.setAttribute("y", space * 0.8); // 꼭지점 y
  textMark.textContent = maxValue;
  graph.appendChild(textMark);

  // 절반 기준점 생성
  const textHalf = document.createElementNS(svgNS, "line");
  textHalf.setAttribute("x1", space - 5); // 왼쪽 꼭지점 x
  textHalf.setAttribute("y1", contentHeight / 2 + space / 2); // 왼쪽 꼭지점 y
  textHalf.setAttribute("x2", space); // 오른쪽 꼭지점 x
  textHalf.setAttribute("y2", contentHeight / 2 + space / 2); // 오른쪽 꼭지점 y
  textHalf.classList.add("graph-axis");
  graph.appendChild(textHalf);
};

/** JSON 업데이트 function */
const updateJson = (listObj) => {
  json.value = JSON.stringify(listObj, null, "\t"); // 존재하는 값 Object to Json 변환
  json.style.height = "auto"; // height 값 초기화
  json.style.height = `${json.scrollHeight + 10}px`; // 콘텐츠 영역에 맞춰 height 자동설정
  if (!btnAdded) {
    // 하단에 apply(변경-json) 버튼 삽입
    addBtnToElement(json, "Apply", "btn-add", (event) => {
      try {
        const updatedListObj = JSON.parse(json.value); // 유저가 입력한 값 Json to Object 변환

        // 작성한 값이 숫자형이 맞는지 확인
        updatedListObj.map((data) => {
          if (!Number.isInteger(data.id) || !Number.isInteger(data.value)) {
            throw SyntaxError;
          }
        });

        // 작성한 값이 Array가 맞는지 확인
        if (Array.isArray(updatedListObj)) {
          listObj = updatedListObj;
          updateTable(listObj);
          alert("고급 편집 값으로 변경했습니다."); // 값 변경 확인창
        } else {
          throw SyntaxError;
        }
      } catch (error) {
        alert("JSON 형식으로 다시 입력해주세요. 값은 숫자만 가능합니다.");
        updateJson(listObj);
      }
    });
  }
};

/** 객체 업데이트 function */
const updateObject = (listObj) => {
  updateGraph(listObj);
  updateJson(listObj);
};

/** 테이블 업데이트 및 로딩 function */
const updateTable = (listObj) => {
  const tbody = document.createElement("tbody");
  listObj.map((item, index) => {
    const row = tbody.insertRow(); // 열 추가
    const cell0 = row.insertCell(0); // 행 추가
    const cell1 = row.insertCell(1); // 행 추가
    const cell2 = row.insertCell(2); // 행 추가
    const valueInput = createInput("number", item.value, "input-table"); // 값입력란 생성
    const delBtn = createInput("button", "삭제", "btn-del"); // 삭제버튼 생성
    cell0.innerHTML = item.id; // id 삽입
    cell1.appendChild(valueInput); // value 삽입
    cell2.appendChild(delBtn); // 삭제 버튼 삽입
    delBtn.addEventListener("click", () => {
      // 삭제 전 확인 창
      if (window.confirm("정말로 삭제하시겠습니까?")) {
        row.remove(); // 데이터가 있는 열 삭제
        listObj.splice(index, 1); // 데이터 삭제
        updateObject(listObj);
      }
    });

    // // input 입력하면 순간 값 변경되는 동기화 버전
    // valueInput.addEventListener("input", (event) => {
    //  listObj[index].value = event.target.value;
    //  updateJson(listObj);
    // });
  });

  const existingTbody = table.querySelector("tbody");
  if (existingTbody || btnAdded) {
    table.removeChild(existingTbody); // tbody에 데이터가 있으면 삭제
  } else {
    // 하단에 apply(변경-table) 버튼 삽입
    addBtnToElement(table, "Apply", "btn-add", (event) => {
      listObj = Array.from(tbody.rows).map((row) => ({
        id: Number(row.cells[0].textContent),
        value: Number(row.cells[1].children[0].value),
      }));
      alert("편집 값으로 변경했습니다."); // 값 변경 확인창
      updateObject(listObj);
    });
  }
  updateObject(listObj);
  table.appendChild(tbody);
};

// 하단의 add(추가) 버튼 가져오기 + 이벤트 등록
const insertBtn = document.getElementById("btn-insert");
insertBtn.addEventListener("click", (event) => {
  const indexInput = document.getElementById("index"); // index input 객체 가져오기
  const valueInput = document.getElementById("value"); // value input 객체 가져오기
  const id = indexInput.value
    ? Number(indexInput.value)
    : Number(listObj[listObj.length - 1].id) + 1; // index 값 없을 경우 임의로 id 생성
  const value = Number(valueInput.value);

  // 값 입력 여부 유효성검사
  if (value) {
    listObj.push({ id, value }); // 사용자가 입력한 값 삽입
    alert("값을 추가했습니다."); // 값 추가 확인창
  } else {
    alert("VALUE는 필수입니다.");
  }

  // 입력창 값 초기화
  indexInput.value = "";
  valueInput.value = "";
  updateObject(listObj);
  updateTable(listObj);
});

updateTable(listObj); // 초기 로딩 시 실행
btnAdded = true; // 초기 로딩 후 버튼 생성 완료 여부

// 윈도우 리사이즈 이벤트 발생할 경우 -> 반응형 너비조정
// window.addEventListener("resize", () => {
//   if (graph.clientWidth < 800) {
//     updateGraph(listObj);
//   }
// });
