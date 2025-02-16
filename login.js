// Firebase 設定
const firebaseConfig = {
    // 您的 Firebase 設定
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function() {
    // 檢查是否已經登入
    checkLoginStatus();
    
    // 設定事件監聽器
    setupEventListeners();
});

// 檢查登入狀態
function checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        // 已登入，重導向到主頁
        window.location.href = 'index.html';
    }
}

// 設定事件監聽器
function setupEventListeners() {
    // Google 登入按鈕
    document.getElementById('googleLoginBtn').addEventListener('click', handleGoogleLogin);
    
    // 訪客模式按鈕
    document.getElementById('guestLoginBtn').addEventListener('click', handleGuestLogin);
    
    // 顯示訪客模式警告
    document.getElementById('guestLoginBtn').addEventListener('mouseover', function() {
        document.getElementById('guestAlert').style.display = 'block';
    });
}

// 處理 Google 登入
async function handleGoogleLogin() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        
        // 儲存使用者資料
        const userData = {
            uid: result.user.uid,
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            loginMethod: 'google'
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // 重導向到主頁
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google 登入失敗:', error);
        alert('登入失敗，請稍後再試');
    }
}

// 處理訪客登入
function handleGuestLogin() {
    // 確認使用者了解訪客模式的限制
    const confirmed = confirm('訪客模式下，您的資料僅會暫存在本機，無法跨裝置同步。是否繼續？');
    
    if (confirmed) {
        // 建立訪客資料
        const guestData = {
            uid: 'guest_' + Date.now(),
            displayName: '訪客',
            email: null,
            photoURL: null,
            loginMethod: 'guest'
        };
        
        localStorage.setItem('userData', JSON.stringify(guestData));
        
        // 重導向到主頁
        window.location.href = 'index.html';
    }
}

// 登出功能
function logout() {
    // 清除本地儲存的資料
    localStorage.clear();
    
    // 如果是 Google 登入，還需要登出 Firebase
    if (auth.currentUser) {
        auth.signOut();
    }
    
    // 重導向到登入頁
    window.location.href = 'login.html';
} 