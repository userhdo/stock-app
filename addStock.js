let searchTimeout;
const stockCache = new Map();

document.addEventListener('DOMContentLoaded', function() {
    // 檢查登入狀態
    if (!localStorage.getItem('userData')) {
        window.location.href = 'login.html';
        return;
    }

    setupEventListeners();
});

function setupEventListeners() {
    const stockCodeInput = document.getElementById('stockCode');
    
    // 輸入時即時搜尋
    stockCodeInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const value = e.target.value.trim();
        
        if (value.length >= 2) {
            searchTimeout = setTimeout(() => searchStock(value), 300);
        } else {
            clearSuggestions();
            hidePreview();
        }
    });

    // 表單提交
    document.getElementById('addStockForm').addEventListener('submit', handleAddStock);
}

async function searchStock(query) {
    try {
        // 如果已經有快取，直接使用快取資料
        if (stockCache.has(query)) {
            showSuggestions(stockCache.get(query));
            return;
        }

        const response = await fetch(`/api/stock/search?q=${query}`);
        if (!response.ok) throw new Error('搜尋失敗');
        
        const data = await response.json();
        stockCache.set(query, data);
        showSuggestions(data);
    } catch (error) {
        console.error('搜尋錯誤:', error);
    }
}

function showSuggestions(stocks) {
    const container = document.getElementById('suggestions');
    container.innerHTML = stocks.map(stock => `
        <div class="stock-suggestion" onclick="selectStock('${stock.code}', '${stock.name}')">
            ${stock.code} - ${stock.name}
        </div>
    `).join('');
}

function selectStock(code, name) {
    document.getElementById('stockCode').value = code;
    showPreview(code, name);
    clearSuggestions();
}

async function showPreview(code, name) {
    try {
        const stockInfo = await fetchStockInfo(code);
        const preview = document.getElementById('stockPreview');
        preview.classList.add('active');
        
        document.getElementById('previewName').textContent = `${code} ${name}`;
        document.getElementById('previewPrice').textContent = 
            `現價：${stockInfo.price} 元`;
    } catch (error) {
        console.error('取得股票資訊失敗:', error);
    }
}

function clearSuggestions() {
    document.getElementById('suggestions').innerHTML = '';
}

function hidePreview() {
    document.getElementById('stockPreview').classList.remove('active');
}

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