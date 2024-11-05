const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// キャンバスサイズとドーナツの内側と外側の半径を設定
const outerRadius = 150; // ドーナツの外側の半径
const innerRadius = 100; // ドーナツの内側の半径
const ballRadius = (outerRadius - innerRadius) / 2; // ドーナツの幅に合わせた玉の半径

// 玉の初期位置（ドーナツの内壁と外壁の間）
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2 + (outerRadius + innerRadius) / 2,
  radius: ballRadius,
  color: "blue"
};

// 加速度センサーの値を表示する要素を取得
const xDisplay = document.getElementById("xValue");
const yDisplay = document.getElementById("yValue");
const zDisplay = document.getElementById("zValue");

// 加速度データを使って玉を動かす
window.addEventListener("devicemotion", (event) => {
  const accX = event.accelerationIncludingGravity.x; // x軸の加速度
  const accY = event.accelerationIncludingGravity.y; // y軸の加速度
  const accZ = event.accelerationIncludingGravity.z; // z軸の加速度

  // データを画面に表示
  xDisplay.textContent = accX.toFixed(2);
  yDisplay.textContent = accY.toFixed(2);
  zDisplay.textContent = accZ.toFixed(2);

  // 玉の位置を更新（加速度に基づいて移動）
  ball.x += accX * 2;
  ball.y += accY * 2;

  // 玉がドーナツの内壁と外壁の間に収まるように制限
  const distanceX = ball.x - canvas.width / 2;
  const distanceY = ball.y - canvas.height / 2;
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
  const minDistance = innerRadius + ball.radius;
  const maxDistance = outerRadius - ball.radius;

  if (distance < minDistance) {
    ball.x = canvas.width / 2 + (distanceX / distance) * minDistance;
    ball.y = canvas.height / 2 + (distanceY / distance) * minDistance;
  } else if (distance > maxDistance) {
    ball.x = canvas.width / 2 + (distanceX / distance) * maxDistance;
    ball.y = canvas.height / 2 + (distanceY / distance) * maxDistance;
  }

  draw();
});

// 玉とドーナツの描画
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // ドーナツを描画
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, (outerRadius + innerRadius) / 2, 0, Math.PI * 2);
  context.strokeStyle = "gray";
  context.lineWidth = outerRadius - innerRadius; // ドーナツの幅
  context.stroke();

  // 玉を描画
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = ball.color;
  context.fill();
}

// 初回描画
draw();
