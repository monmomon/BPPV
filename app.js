const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// ドーナツと玉の半径設定
const outerRadius = 150;
const innerRadius = 100;
const ballRadius = (outerRadius - innerRadius) / 2;

// 玉の初期位置（ドーナツの内壁と外壁の間、下側に配置）
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2 + (outerRadius + innerRadius) / 2,
  radius: ballRadius,
  color: "blue"
};

// 加速度の変数
let aX = 0, aY = 0, aZ = 0;

// データ表示要素
const xDisplay = document.getElementById("txt");

// デバイスを特定して軸の補正をする関数
function adjustAxes() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      // iOS Safari - reverse Y-axis
      return { x: aX, y: -aY, z: aZ };
    } else {
      // iOS Chrome - no adjustment needed
      return { x: aX, y: aY, z: aZ };
    }
  } else if (userAgent.includes("android")) {
    // Android Chrome - reverse both X and Y axes
    return { x: -aX, y: -aY, z: aZ };
  }
  // Default case - no adjustment needed
  return { x: aX, y: aY, z: aZ };
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
    aY = dat.accelerationIncludingGravity.y;
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
  const adjusted = adjustAxes();
  xDisplay.innerHTML = "x: " + adjusted.x.toFixed(2) + "<br>" + "y: " + adjusted.y.toFixed(2) + "<br>" + "z: " + adjusted.z.toFixed(2);
}

// 玉の位置を更新する関数
function updateBallPosition() {
  const adjusted = adjustAxes();

  // 加速度に基づいて玉の位置を更新
  ball.x += adjusted.x * 2;
  ball.y += adjusted.y * 2;

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
  context.strokeStyle = "gray";
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
