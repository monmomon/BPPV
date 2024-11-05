const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

canvas.width = 400; // キャンバスの幅
canvas.height = 400; // キャンバスの高さ

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  color: "blue"
};

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // ドーナツの中央を空けた円を描画
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
  context.strokeStyle = "gray";
  context.lineWidth = 10;
  context.stroke();

  // 玉を描画
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = ball.color;
  context.fill();
}

// デバイスの傾きに基づいて玉を動かす
window.addEventListener("deviceorientation", (event) => {
  const gravityX = event.gamma / 90; // 左右の傾き
  const gravityY = event.beta / 90;  // 上下の傾き

  // ドーナツの内側で玉を動かす
  ball.x += gravityX * 2;
  ball.y += gravityY * 2;

  // 玉がドーナツの外に出ないようにする
  const distanceX = ball.x - canvas.width / 2;
  const distanceY = ball.y - canvas.height / 2;
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
  const maxDistance = 135;

  if (distance > maxDistance) {
    ball.x = canvas.width / 2 + (distanceX / distance) * maxDistance;
    ball.y = canvas.height / 2 + (distanceY / distance) * maxDistance;
  }

  draw();
});

// 初回描画
draw();
