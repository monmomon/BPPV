const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const outerRadius = 150;
const innerRadius = 100;
const ballRadius = (outerRadius - innerRadius) / 2;

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2 + (outerRadius + innerRadius) / 2,
  radius: ballRadius,
  color: "blue"
};

let aX = 0, aY = 0, aZ = 0;
const xDisplay = document.getElementById("txt");

// OS判別
const isAndroid = /Android/i.test(navigator.userAgent);
const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// 加速度センサーの許可リクエスト
function startMotion() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(permissionState => {
      if (permissionState === 'granted') {
        startMotionDetection();
      } else {
        alert("デバイスの重力センサーへのアクセスが許可されていません。設定で許可してください。");
      }
    }).catch(console.error);
  } else {
    startMotionDetection();
  }
}

// 加速度センサーのデータ取得を開始
function startMotionDetection() {
  window.addEventListener("devicemotion", (dat) => {
    if (isiOS) {
      aX = dat.accelerationIncludingGravity.x;
      aY = -dat.accelerationIncludingGravity.y; // iOSでY軸の符号を反転
    } else if (isAndroid) {
      aX = -dat.accelerationIncludingGravity.x; // AndroidでX軸とY軸の符号を反転
      aY = dat.accelerationIncludingGravity.y;
    }
    aZ = dat.accelerationIncludingGravity.z;
  });

  setInterval(() => {
    updateBallPosition();
    displayData();
  }, 33);
}

// データを表示する関数
function displayData() {
  xDisplay.innerHTML = "x: " + aX.toFixed(2) + "<br>" + "y: " + aY.toFixed(2) + "<br>" + "z: " + aZ.toFixed(2);
}

function updateBallPosition() {
  ball.x += aX * 2;
  ball.y += aY * 2;

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

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, (outerRadius + innerRadius) / 2, 0, Math.PI * 2);
  context.strokeStyle = "gray";
  context.lineWidth = outerRadius - innerRadius;
  context.stroke();

  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = ball.color;
  context.fill();
}

// 初回描画
draw();
