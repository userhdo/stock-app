document.addEventListener('DOMContentLoaded', function() {
    // 檢查登入狀態
    if (!localStorage.getItem('userData')) {
        window.location.href = 'login.html';
        return;
    }

    loadSettings();
    setupEventListeners();
});

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    document.getElementById('priceAlertPercentage').value = 
        settings.priceAlertPercentage || 5;
    document.getElementById('refreshInterval').value = 
        settings.refreshInterval || 60;
    document.getElementById('enableNotifications').checked = 
        settings.enableNotifications || false;
}

function setupEventListeners() {
    document.getElementById('conditionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const settings = {
            priceAlertPercentage: parseFloat(document.getElementById('priceAlertPercentage').value),
            refreshInterval: parseInt(document.getElementById('refreshInterval').value),
            enableNotifications: document.getElementById('enableNotifications').checked
        };
        
        saveSettings(settings);
    });
}

function saveSettings(settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    if (settings.enableNotifications) {
        requestNotificationPermission();
    }
    
    alert('設定已儲存');
    window.location.href = 'index.html';
}

async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('需要開啟通知權限才能接收股價提醒');
        }
    }
} 