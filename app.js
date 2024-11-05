const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// ドーナツの設定
const outerRadius = 150;
const innerRadius = 100;
const ballRadius = (outerRadius - innerRadius) / 2;

// ドーナツの初期設定
let donutColor = "black"; // 右後半規管が選択されたときの色（黒）
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2 + (outerRadius + innerRadius) / 2,
  radius: ballRadius,
  color: "blue"
};

// 加速度の変数
let aX = 0, aY = 0, aZ = 0;
const xDisplay = document.getElementById("txt");

// ボタン選択で加速度センサーの許可をリクエスト
function startWithCanal(canal) {
  if (canal === 'left') {
    donutColor = "white"; // 左後半規管の色（白）
  } else {
    donutColor = "black"; // 右後半規管の色（黒）
  }

  requestPermission();
}

// iOS 13+ 向けの許可リクエスト
function requestPermission() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          startMotionDetection();
        } else {
          alert("デバイスの重力センサーへのアクセスが許可されていません。設定で許可してください。");
        }
      })
      .catch(console.error);
  } else {
    // Androidなど許可が不要な環境の場合、そのまま開始
    startMotionDetection();
  }
}

// 加速度センサーのデータ取得を開始
function startMotionDetection() {
  window.addEventListener("devicemotion", (dat) => {
    aX = dat.accelerationIncludingGravity.x;
    aY = -dat.accelerationIncludingGravity.y; // iPhoneでのY軸を逆に
    aZ = dat.accelerationIncludingGravity.z;
  });

  // 33msごとに玉の位置を更新し、データを表示
  setInterval(() => {
    updateBallPosition();
    displayData();
  }, 33);
}

// データを表示する関数
function displayData() {
  xDisplay.innerHTML = "x: " + aX.toFixed(2) + "<br>" + "y: " + aY.toFixed(2) + "<br>" + "z: " + aZ.toFixed(2);
}

// 玉の位置を更新する関数
function updateBallPosition() {
  ball.x += aX * 2;
  ball.y += aY * 2;

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

// ドーナツと玉を描画する関数
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // ドーナツを描画
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, (outerRadius + innerRadius) / 2, 0, Math.PI * 2);
  context.strokeStyle = donutColor; // ドーナツの色を設定
  context.lineWidth = outerRadius - innerRadius;
  context.stroke();

  // 玉を描画
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = ball.color;
  context.fill();
}

// 初回描画
draw();
