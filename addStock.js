document.addEventListener('DOMContentLoaded', function() {
    // 檢查登入狀態
    if (!localStorage.getItem('userData')) {
        window.location.href = 'login.html';
        return;
    }

    const form = document.getElementById('addStockForm');
    form.addEventListener('submit', handleAddStock);
});

async function handleAddStock(event) {
    event.preventDefault();
    
    const stockCode = document.getElementById('stockCode').value.trim();
    const shares = parseInt(document.getElementById('shares').value);

    try {
        // 檢查股票代碼是否有效
        const stockInfo = await fetchStockInfo(stockCode);
        
        // 儲存股票資訊
        const stockList = JSON.parse(localStorage.getItem('stockList') || '[]');
        stockList.push({
            code: stockCode,
            name: stockInfo.name,
            shares: shares,
            currentPrice: stockInfo.price,
            previousClose: stockInfo.previousClose,
            buyPrice: 0,
            sellPrice: 0
        });
        
        localStorage.setItem('stockList', JSON.stringify(stockList));
        
        // 返回主頁
        window.location.href = 'index.html';
    } catch (error) {
        alert('無效的股票代碼或發生錯誤');
    }
}

// 模擬從 Yahoo Finance API 獲取股票資訊
async function fetchStockInfo(code) {
    // 這裡應該實作實際的 API 呼叫
    // 目前返回模擬資料
    return {
        name: `測試股票${code}`,
        price: 100,
        previousClose: 98
    };
} 