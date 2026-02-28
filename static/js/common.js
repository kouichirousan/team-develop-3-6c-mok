/* ============================================
   彦田ブルー（仮名前）- 共通JavaScript
   サイドバー・ルーティング・localStorage管理
   ============================================ */

// ============================================
// サイドバー生成
// ============================================
function renderSidebar(activePage) {
  const role = localStorage.getItem('userRole') || 'employee';
  const isAdmin = role === 'admin';

  const menuItems = [
    { id: 'home', label: 'ホーム', icon: '🏠', href: 'home.html' },
    { id: 'map', label: 'マップ', icon: '🗺️', href: 'map.html' },
    { id: 'badges', label: 'バッジ', icon: '🏅', href: 'badges.html' },
    { id: 'lunch', label: 'ランチ', icon: '🍽️', href: 'lunch.html' },
    { id: 'settings', label: '設定', icon: '⚙️', href: 'settings.html' },
  ];

  const adminItems = [
    { id: 'executive', label: '経営ダッシュボード', icon: '📊', href: 'executive.html' },
    { id: 'office-settings', label: 'オフィス設定', icon: '🏢', href: 'office-settings.html' },
    { id: 'cost-simulation', label: 'コストシミュレーション', icon: '💰', href: 'cost-simulation.html' },
  ];

  let navHTML = '<div class="nav-label">メニュー</div>';
  menuItems.forEach(item => {
    const activeClass = activePage === item.id ? 'active' : '';
    navHTML += `
      <a href="${item.href}" class="nav-item ${activeClass}">
        <span class="nav-item-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `;
  });

  if (isAdmin) {
    navHTML += '<div class="nav-label" style="margin-top:1rem;">管理者メニュー</div>';
    adminItems.forEach(item => {
      const activeClass = activePage === item.id ? 'active' : '';
      navHTML += `
        <a href="${item.href}" class="nav-item ${activeClass}">
          <span class="nav-item-icon">${item.icon}</span>
          <span>${item.label}</span>
        </a>
      `;
    });
  }

  const sidebarHTML = `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-wave-icon">🌊</div>
        <div class="sidebar-title">彦田ブルー</div>
        <div class="sidebar-subtitle">（仮名前）</div>
      </div>

      <div class="sidebar-user-card">
        <div class="sidebar-avatar">田</div>
        <div>
          <div class="sidebar-user-name">田中太郎</div>
          <div class="sidebar-user-badges">🏅 バッジ × 3</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${navHTML}
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" onclick="handleLogout()">
          <span>🚪</span>
          <span>ログアウト</span>
        </button>
      </div>
    </div>

    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
    <button class="mobile-hamburger" id="hamburgerBtn" onclick="toggleSidebar()">☰</button>
  `;

  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

// ============================================
// サイドバー開閉
// ============================================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ============================================
// ログアウト
// ============================================
function handleLogout() {
  localStorage.removeItem('userRole');
  window.location.href = 'login.html';
}

// ============================================
// 認証チェック
// ============================================
function checkAuth() {
  const role = localStorage.getItem('userRole');
  if (!role) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function checkAdmin() {
  const role = localStorage.getItem('userRole');
  if (role !== 'admin') {
    window.location.href = 'home.html';
    return false;
  }
  return true;
}

// ============================================
// 紙吹雪表示
// ============================================
function showConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const emojis = ['🎉', '⭐', '🎊', '✨', '🌟'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.left = Math.random() * 100 + '%';
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 5000);
}

// ============================================
// バッジ獲得モーダル
// ============================================
function showBadgeUnlockModal(badgeName) {
  const overlay = document.getElementById('badgeModal');
  if (overlay) {
    overlay.querySelector('.badge-modal-name').textContent = badgeName;
    overlay.classList.add('show');
    setTimeout(() => overlay.classList.remove('show'), 3000);
  }
}

// ============================================
// モックデータ
// ============================================
const mockUsers = [
  { id: 'user-1', name: '田中太郎', department: '開発部' },
  { id: 'user-2', name: '佐藤花子', department: 'デザイン部' },
  { id: 'user-3', name: '鈴木一郎', department: '営業部' },
  { id: 'user-4', name: '高橋美咲', department: 'マーケティング部' },
  { id: 'user-5', name: '山田健太', department: '開発部' },
];

const mockUserBadges = {
  'user-1': ['early_bird_bronze', 'early_bird_silver', 'office_guardian'],
};

const badgeConfigs = {
  early_bird_bronze: { name: '早起き鳥 (Bronze)', icon: '🌅', desc: '3日連続早朝チェックイン', colorClass: 'badge-amber' },
  early_bird_silver: { name: '早起き鳥 (Silver)', icon: '🌅', desc: '7日連続早朝チェックイン', colorClass: 'badge-gray' },
  early_bird_gold: { name: '早起き鳥 (Gold)', icon: '🌅', desc: '14日連続早朝チェックイン', colorClass: 'badge-yellow' },
  office_guardian: { name: 'オフィスの守り人', icon: '🛡️', desc: '累計滞在100時間達成', colorClass: 'badge-ocean' },
  food_fighter: { name: 'フードファイター', icon: '🍱', desc: '5人の異なる部署とランチ', colorClass: 'badge-coral' },
};

// ============================================
// オーシャンヒートマップ生成
// ============================================
function renderOceanHeatmap(containerId, checkedInCount, capacity) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const percentage = (checkedInCount / capacity) * 100;
  let bgClass = 'ocean-light-bg';
  if (percentage >= 70) bgClass = 'ocean-deep-bg';
  else if (percentage >= 40) bgClass = 'ocean-medium-bg';

  // 魚の生成
  const fishEmojis = ['🐠', '🐟', '🐡', '🦈', '🐙'];
  let fishHTML = '';
  const fishCount = Math.min(checkedInCount, 20);
  for (let i = 0; i < fishCount; i++) {
    const emoji = fishEmojis[Math.floor(Math.random() * fishEmojis.length)];
    const top = 20 + Math.random() * 50;
    const left = 5 + Math.random() * 85;
    const delay = Math.random() * 5;
    fishHTML += `<div class="ocean-fish" style="top:${top}%;left:${left}%;animation-delay:${delay}s">${emoji}</div>`;
  }

  // 泡の生成
  let bubbleHTML = '';
  for (let i = 0; i < 8; i++) {
    const left = 10 + Math.random() * 80;
    const delay = Math.random() * 4;
    const duration = 3 + Math.random() * 3;
    bubbleHTML += `<div class="ocean-bubble" style="left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s"></div>`;
  }

  container.innerHTML = `
    <div class="ocean-water ${bgClass}"></div>
    <div class="ocean-wave"></div>
    ${fishHTML}
    ${bubbleHTML}
    <div class="ocean-floor">🪸 🐚 ⭐ 🪸 🐚</div>
    <div class="ocean-count">
      <div class="count-number">${checkedInCount} / ${capacity}</div>
      <div class="count-label">人が出社中</div>
    </div>
  `;
}

// ============================================
// トグルスイッチ
// ============================================
function toggleSwitch(el) {
  if (el.classList.contains('on')) {
    el.classList.remove('on');
    el.classList.add('off');
  } else {
    el.classList.remove('off');
    el.classList.add('on');
  }
}

// ============================================
// フェードインアニメーション
// ============================================
function animateElements() {
  const elements = document.querySelectorAll('.animate-on-load');
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 100);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  animateElements();
});
