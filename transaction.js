// 定義全域變數
let transactions = [];
let stocks = [];

// 當文檔載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 檢查使用者登入狀態
    if (!localStorage.getItem('userData')) {
        window.location.href = 'login.html';
        return;
    }

    // 初始化頁面
    initializePage();
    // 設定事件監聽器
    setupEventListeners();
});

// 初始化頁面
function initializePage() {
    // 從 LocalStorage 載入資料
    loadData();
    // 更新股票選擇下拉選單
    updateStockSelect();
    // 更新交易記錄表格
    updateTransactionTable();
    // 設定日期輸入框預設值為今天
    document.getElementById('date').valueAsDate = new Date();
}

// 載入所需資料
function loadData() {
    // 從 LocalStorage 載入股票清單
    stocks = JSON.parse(localStorage.getItem('stockList') || '[]');
    // 從 LocalStorage 載入交易記錄
    transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
}

// 設定事件監聽器
function setupEventListeners() {
    // 儲存交易按鈕點擊事件
    document.getElementById('saveTransaction').addEventListener('click', handleSaveTransaction);
    // 篩選器變更事件
    document.getElementById('stockFilter').addEventListener('change', updateTransactionTable);
    document.getElementById('typeFilter').addEventListener('change', updateTransactionTable);
}

// 更新股票選擇下拉選單
function updateStockSelect() {
    const stockSelect = document.getElementById('stockCode');
    const stockFilter = document.getElementById('stockFilter');
    
    // 清空現有選項
    stockSelect.innerHTML = '';
    stockFilter.innerHTML = '<option value="">所有股票</option>';
    
    // 添加股票選項
    stocks.forEach(stock => {
        const option = `<option value="${stock.code}">${stock.code} - ${stock.name}</option>`;
        stockSelect.insertAdjacentHTML('beforeend', option);
        stockFilter.insertAdjacentHTML('beforeend', option);
    });
}

// 更新交易記錄表格
function updateTransactionTable() {
    const tbody = document.getElementById('transactionList');
    const stockFilter = document.getElementById('stockFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    // 篩選交易記錄
    let filteredTransactions = transactions.filter(trans => {
        const matchStock = !stockFilter || trans.stockCode === stockFilter;
        const matchType = !typeFilter || trans.type === typeFilter;
        return matchStock && matchType;
    });
    
    // 依日期排序（新到舊）
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 更新表格內容
    tbody.innerHTML = filteredTransactions.map(trans => `
        <tr>
            <td>${trans.date}</td>
            <td>${trans.stockCode}</td>
            <td class="${trans.type === 'buy' ? 'text-danger' : 'text-success'}">
                ${trans.type === 'buy' ? '買入' : '賣出'}
            </td>
            <td>${trans.price}</td>
            <td>${trans.quantity}</td>
            <td>${(trans.price * trans.quantity).toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteTransaction('${trans.id}')">
                    刪除
                </button>
            </td>
        </tr>
    `).join('');
}

// 處理儲存交易
function handleSaveTransaction() {
    // 取得表單資料
    const formData = {
        id: Date.now().toString(), // 使用時間戳作為唯一識別碼
        stockCode: document.getElementById('stockCode').value,
        type: document.getElementById('transactionType').value,
        price: parseFloat(document.getElementById('price').value),
        quantity: parseInt(document.getElementById('quantity').value),
        date: document.getElementById('date').value
    };
    
    // 驗證資料
    if (!validateTransaction(formData)) {
        return;
    }
    
    // 新增交易記錄
    transactions.push(formData);
    // 儲存到 LocalStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // 更新持股數量
    updateStockShares(formData);
    
    // 關閉 Modal 並更新表格
    bootstrap.Modal.getInstance(document.getElementById('addTransactionModal')).hide();
    updateTransactionTable();
}

// 驗證交易資料
function validateTransaction(data) {
    if (data.price <= 0) {
        alert('價格必須大於 0');
        return false;
    }
    if (data.quantity <= 0) {
        alert('數量必須大於 0');
        return false;
    }
    
    // 賣出時檢查庫存
    if (data.type === 'sell') {
        const stock = stocks.find(s => s.code === data.stockCode);
        if (!stock || stock.shares < data.quantity) {
            alert('庫存不足');
            return false;
        }
    }
    
    return true;
}

// 更新持股數量
function updateStockShares(transaction) {
    const stockIndex = stocks.findIndex(s => s.code === transaction.stockCode);
    if (stockIndex !== -1) {
        const change = transaction.type === 'buy' ? transaction.quantity : -transaction.quantity;
        stocks[stockIndex].shares += change;
        localStorage.setItem('stockList', JSON.stringify(stocks));
    }
}

// 刪除交易記錄
function deleteTransaction(id) {
    if (!confirm('確定要刪除此筆交易紀錄嗎？')) {
        return;
    }
    
    // 找到要刪除的交易
    const transIndex = transactions.findIndex(t => t.id === id);
    if (transIndex === -1) return;
    
    const transaction = transactions[transIndex];
    
    // 恢復持股數量
    const reverseTransaction = {
        ...transaction,
        type: transaction.type === 'buy' ? 'sell' : 'buy'
    };
    updateStockShares(reverseTransaction);
    
    // 刪除交易記錄
    transactions.splice(transIndex, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // 更新表格
    updateTransactionTable();
} 