// 主要邏輯處理
document.addEventListener('DOMContentLoaded', function() {
    // 檢查登入狀態
    checkLoginStatus();
    
    // 載入股票列表
    loadStockList();
    
    // 設定使用者頭像點擊事件
    setupUserProfileEvents();
});

// 檢查登入狀態
function checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userData);
    document.getElementById('userAvatar').src = user.photoURL;
}

// 載入股票列表
function loadStockList() {
    const stockList = JSON.parse(localStorage.getItem('stockList') || '[]');
    const container = document.getElementById('stockList');
    
    stockList.forEach(stock => {
        const card = createStockCard(stock);
        container.appendChild(card);
    });
}

// 建立股票卡片
function createStockCard(stock) {
    const div = document.createElement('div');
    div.className = 'col-md-6 col-lg-4';
    
    const priceClass = stock.currentPrice > stock.previousClose ? 
        'stock-price-up' : 'stock-price-down';
    
    div.innerHTML = `
        <div class="stock-card ${needsAlert(stock) ? 'alert' : ''}">
            <h5>${stock.code} ${stock.name}</h5>
            <p class="${priceClass}">現價：${stock.currentPrice}</p>
            <p>持股數：${stock.shares}</p>
            <p>可買價：${stock.buyPrice}</p>
        </div>
    `;
    
    div.onclick = () => {
        window.location.href = `stockSetting.html?code=${stock.code}`;
    };
    
    return div;
}

// 設定使用者頭像相關事件
function setupUserProfileEvents() {
    const avatar = document.getElementById('userAvatar');
    const dropdown = document.getElementById('userDropdown');
    
    avatar.onclick = () => {
        dropdown.style.display = 
            dropdown.style.display === 'none' ? 'block' : 'none';
    };
    
    document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    };
} 