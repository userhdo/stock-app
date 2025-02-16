let currentStock = null;

document.addEventListener('DOMContentLoaded', function() {
    // 檢查登入狀態
    if (!localStorage.getItem('userData')) {
        window.location.href = 'login.html';
        return;
    }

    // 取得 URL 參數中的股票代碼
    const urlParams = new URLSearchParams(window.location.search);
    const stockCode = urlParams.get('code');
    
    if (!stockCode) {
        window.location.href = 'index.html';
        return;
    }

    loadStockData(stockCode);
    setupEventListeners();
});

function loadStockData(code) {
    const stockList = JSON.parse(localStorage.getItem('stockList') || '[]');
    currentStock = stockList.find(stock => stock.code === code);
    
    if (!currentStock) {
        window.location.href = 'index.html';
        return;
    }

    // 更新頁面資訊
    document.getElementById('stockTitle').textContent = `${currentStock.code} 設定`;
    document.getElementById('stockName').textContent = currentStock.name;
    document.getElementById('currentPrice').textContent = `現價：${currentStock.currentPrice}`;
    document.getElementById('buyPrice').value = currentStock.buyPrice || '';
    document.getElementById('sellPrice').value = currentStock.sellPrice || '';
}

function setupEventListeners() {
    // 設定表單提交事件
    document.getElementById('settingForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const buyPrice = parseFloat(document.getElementById('buyPrice').value);
        const sellPrice = parseFloat(document.getElementById('sellPrice').value);
        
        updateStockSettings(buyPrice, sellPrice);
    });

    // 設定刪除按鈕事件
    document.getElementById('deleteBtn').addEventListener('click', function() {
        if (confirm('確定要刪除此股票嗎？')) {
            deleteStock();
        }
    });
}

function updateStockSettings(buyPrice, sellPrice) {
    const stockList = JSON.parse(localStorage.getItem('stockList') || '[]');
    const index = stockList.findIndex(stock => stock.code === currentStock.code);
    
    if (index !== -1) {
        stockList[index].buyPrice = buyPrice;
        stockList[index].sellPrice = sellPrice;
        localStorage.setItem('stockList', JSON.stringify(stockList));
        alert('設定已儲存');
        window.location.href = 'index.html';
    }
}

function deleteStock() {
    const stockList = JSON.parse(localStorage.getItem('stockList') || '[]');
    const newStockList = stockList.filter(stock => stock.code !== currentStock.code);
    localStorage.setItem('stockList', JSON.stringify(newStockList));
    window.location.href = 'index.html';
} 