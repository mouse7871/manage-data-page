// 더미데이터
const listObj = [
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
const table = document.getElementById("value-table"); // 2. 값 편집 - 테이블
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
  const ctx = graph.getContext("2d");
  ctx.clearRect(0, 0, graph.width, graph.height);
  const margin = 20;
  const width = graph.width - 2 * margin;
  const height = graph.height - 2 * margin;

  listObj.map((obj, index) => {
    const barWidth = width / (listObj.length * 2);
    const x = margin + index * barWidth * 2 + 20;
    const barHeight = (obj.value / 100) * height;
    const y = graph.height - margin - barHeight;

    ctx.fillStyle = "#045fd4"; // --blue-color 변수와 값 같음
    ctx.fillRect(x, y, barWidth, barHeight);

    // x축 눈금과 레이블
    ctx.fillStyle = "black";
    ctx.fillText(obj.id, x + barWidth - 15, graph.height - margin + 15);

    // y축 눈금과 레이블
    if (index % 20 === 0) {
      ctx.fillText(100 - index, margin - 10, y + 5);
    }
  });

  // x축과 y축
  ctx.beginPath();
  ctx.moveTo(margin + 10, graph.height - margin);
  ctx.lineTo(margin + 10, margin);
  ctx.moveTo(margin + 10, graph.height - margin);
  ctx.lineTo(graph.width - margin, graph.height - margin);
  ctx.stroke();
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
    updateObject(listObj);
  }
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
