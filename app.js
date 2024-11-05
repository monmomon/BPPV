// iOS 13+ / Android での重力センサーアクセス許可をリクエスト
if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
  DeviceMotionEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        window.addEventListener("deviceorientation", handleOrientation);
      } else {
        alert("デバイスの重力センサーへのアクセスが許可されていません。設定で許可してください。");
      }
    })
    .catch(console.error);
} else {
  // 通常のブラウザ用（アクセス許可が不要な場合）
  window.addEventListener("deviceorientation", handleOrientation);
}

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// キャンバスサイズを設定
canvas.width = 400; // キャンバスの幅
canvas.height = 400; // キャンバスの高さ

// ドーナツの内側と外側の半径を設定
const outerRadius = 150; // ドーナツの外側の半径
const innerRadius = 100; // ドーナツの内側の半径

// 玉の半径（内壁と外壁の間に配置されるサイズ）
const ballRadius = (outerRadius - innerRadius) / 2; // ドーナツの幅に合わせた玉の半径

// 玉の初期位置（ドーナツの内壁と外壁の間、下側に配置）
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2 + (outerRadius + innerRadius) / 2, // ドーナツの内壁と外壁の中間
  radius: ballRadius,
  color: "blue"
};

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // ドーナツ（外側の円と内側の円で表現）
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

// デバイスの傾きに基づいて玉を動かす処理
function handleOrientation(event) {
  const gravityX = event.gamma / 90; // 左右の傾き
  const gravityY = event.beta / 90;  // 上下の傾き

  // 玉の位置を更新（スマホの傾きに応じて移動）
  ball.x += gravityX * 2;
  ball.y += gravityY * 2;

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
}

// 初回描画
draw();
