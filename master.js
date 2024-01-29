let WIDTH,
  HEIGHT,
  COLS,
  ROWS,
  CELLS = [],
  HUE = 0;

const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  FPS = 60,
  SIZE = 10,
  HUE_DELTA = 0.0005;

function onMouseClick(e) {
  // Obtain top corner of clicked cell
  const x = floor(e.offsetX / SIZE) * SIZE;
  const y = floor(e.offsetY / SIZE) * SIZE;
  const mousePos = new Vector(x, y);

  const target = CELLS.find(el => el.pos.equals(mousePos));
  if (!target) return;

  target.value = 1;
  if (target.fillColor !== "white") return;
  target.fillColor = HSVtoRGB(HUE, 1, 1).string;
}

function init() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  COLS = floor(WIDTH / SIZE);
  ROWS = floor(HEIGHT / SIZE);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      CELLS.push(
        new Cell({
          pos: new Vector(x * SIZE, y * SIZE),
          size: SIZE
        })
      );
    }
  }

  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);

  canvas.addEventListener("mousemove", onMouseClick);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.closePath();

  setInterval(ani, 1000 / FPS);
  //   ani();
}

function ani() {
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const nextCells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      nextCells.push(
        new Cell({
          pos: new Vector(x * SIZE, y * SIZE),
          size: SIZE,
          fillColor: CELLS[IX(x, y, COLS)].fillColor
        })
      );
    }
  }

  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const idx = IX(x, y, COLS);
      const currCell = CELLS[idx];

      if (!currCell.value) continue;
      currCell.draw();

      const belowIdx = IX(x, y + 1, COLS);
      const belowCell = CELLS[belowIdx];

      if (!belowCell) {
        nextCells[idx].value = 1;
        nextCells[idx].fillColor = currCell.fillColor;
        continue;
      }
      if (!belowCell.value) {
        nextCells[idx].value = 0;
        nextCells[idx].fillColor = "white";
        nextCells[belowIdx].value = 1;
        nextCells[belowIdx].fillColor = currCell.fillColor;
        continue;
      }

      const rightCellIdx = IX(x + 1, y + 1, COLS);
      const leftCellIdx = IX(x - 1, y + 1, COLS);
      const rightCell = CELLS[rightCellIdx];
      const leftCell = CELLS[leftCellIdx];

      if (x === 0) {
        if (!rightCell.value) {
          nextCells[rightCellIdx].value = 1;
          nextCells[rightCellIdx].fillColor = currCell.fillColor;

          continue;
        } else {
          nextCells[idx].value = 1;
          nextCells[idx].fillColor = currCell.fillColor;
          continue;
        }
      }

      if (x === COLS - 1) {
        if (!leftCell.value) {
          nextCells[leftCellIdx].value = 1;
          nextCells[leftCellIdx].fillColor = currCell.fillColor;
          continue;
        } else {
          nextCells[idx].value = 1;
          nextCells[idx].fillColor = currCell.fillColor;
          continue;
        }
      }

      if (!rightCell.value) {
        if (!leftCell.value) {
          if (random() > 0.5) {
            nextCells[rightCellIdx].value = 1;
            nextCells[rightCellIdx].fillColor = currCell.fillColor;
          } else {
            nextCells[leftCellIdx].value = 1;
            nextCells[leftCellIdx].fillColor = currCell.fillColor;
          }
        } else {
          nextCells[rightCellIdx].value = 1;
          nextCells[rightCellIdx].fillColor = currCell.fillColor;
        }
      } else {
        if (!leftCell.value) {
          nextCells[leftCellIdx].value = 1;
          nextCells[leftCellIdx].fillColor = currCell.fillColor;
        } else {
          nextCells[idx].value = 1;
          nextCells[idx].fillColor = currCell.fillColor;
        }
      }
    }
  }

  CELLS = nextCells;
  HUE += HUE_DELTA;
}

init();
