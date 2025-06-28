// NOT: Firebase SDK'ları HTML dosyasında <head> veya <body> etiketleri içinde yüklenmelidir.

// Sabitler
const IMAGE_DOWNLOAD_COST_PER_IMAGE = 50;
const VIRTUAL_TOUR_COST_PER_MINUTE = 10;
const VIP_PLAN_CHAT_COST = 10;

// Firebase yapılandırması - KENDİ BİLGİLERİNİZİ BURAYA GİRİN!
// Bu bilgiler Firebase Console'dan alınmalıdır. Güvenli kabul edilir.
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_CLIENT_API_KEY", // Burayı KENDİ GERÇEK BİLGİNİZLE DEĞİŞTİRİN
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // Burayı KENDİ GERÇEK BİLGİNİZLE DEĞİŞTİRİN
    projectId: "YOUR_PROJECT_ID", // Burayı KENDİ GERÇEK BİLGİNİZLE DEĞİŞTİRİN
    storageBucket: "YOUR_PROJECT_ID.appspot.com", // Burayı KENDİ GERÇEK BİLGİNİZLE DEĞİŞTİRİN
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Burayı KENDİ GERÇEK BİLGİNİZLE DEĞİŞTİRİN
    appId: "YOUR_APP_ID", // Burayı KENDİ GERÇEK BİLGİNİZLE DEĞİŞTİRİN
    measurementId: "YOUR_MEASUREMENT_ID", // Burayı KENDİ GERÇEK BİLGİNİZLE DEĞİŞTİRİN
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const functions = firebase.functions('us-central1'); // Firebase Functions'ı belirtilen bölgede başlat
const storage = firebase.storage(); // Firebase Storage'ı başlat (dosya yükleme için)

// Global Değişkenler
let currentUserId = null;
let voiceEnabled = true;
let tatilPuan = 0;
let userMembershipLevel = "Bronz";
let userName = "Misafir";
let userEmail = "Ayarlanmadı";
let gameActive = false;
let currentQuestionIndex = 0;
let gameScore = 0;
let currentGeneratedImages = []; // Son oluşturulan fotoğrafların URL'lerini tutmak için
let generatedVirtualImageUrl = ''; // Sanal tur hediye fotoğrafının URL'sini tutmak için
let currentVipPlan = ""; // VIP planını saklamak için
let palmCoinHistory = []; // PalmCoin geçmişi için dizi
let chatHistory = []; // Main chat history
let aiCompanion = null;
let companionChatHistory = []; // AI Yoldaş sohbet geçmişi

const sloganList = [
    "Hayallerinizin Ötesinde Bir Tatil İçin Kaptanınız Yanınızda!",
    "Keşfedilmeyi Bekleyen Her An, Yapay Zekanın Büyülü Dokunuşuyla!",
    "Rotanızı Çizin, Gerisini Kaptanınıza Bırakın!",
    "Tatil Değil, Bir Deneyim! Sizin İçin Özel Tasarlandı.",
    "Dünyayı Yeniden Tanıyın, Sanal ve Gerçek Kaptanınızla!"
];
let currentSloganIndex = 0;
let currentGameQuestion = null; // Aktif soruyu ve cevabı tutar

// --- DOM Elementleri ---
// Header'daki login/register/logout butonları için tanımlar
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authButtons = document.getElementById('authButtons');
const loggedInUserSection = document.getElementById('loggedInUser');
const usernameDisplay = document.getElementById('usernameDisplay');

// Sohbet Asistanı
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("user-input-chat");
const sendChatBtn = document.getElementById("send-button-chat");
const chatLoading = document.getElementById("chat-loading");
const tatilpuanTop = document.getElementById("tatilpuan-top");
const sloganTop = document.getElementById("slogan-top");
const voiceToggleTop = document.getElementById("voice-toggle-top");
const languageSelect = document.getElementById("language-select");
// const avatarEl = document.getElementById("avatar"); // Avatar kaldırıldığı için kaldırıldı
const userIdDisplay = document.getElementById("user-id-display");
const sidebarButtons = document.querySelectorAll(".sidebar-nav button");
const contentSections = document.querySelectorAll(".content-section");

// Modallar
const appModal = document.getElementById("appModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");

// Giriş/Kayıt Modalları
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const performLoginBtn = document.getElementById('performLoginBtn');
const loginMessage = document.getElementById('loginMessage');
const registerUsernameInput = document.getElementById('registerUsername');
const registerEmailInput = document.getElementById('registerEmail'); // Düzeltildi
const registerPasswordInput = document.getElementById('registerPassword');
const performRegisterBtn = document.getElementById('performRegisterBtn');
const registerMessage = document.getElementById('registerMessage');
const resetEmailInput = document.getElementById('resetEmail');
const performResetBtn = document.getElementById('performResetBtn');
const resetMessage = document.getElementById('resetMessage');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const closeButtons = document.querySelectorAll('.close-button');

// Tatil Avı (Oyun)
const startGameBtn = document.getElementById("start-game-btn");
const gameOutput = document.getElementById("game-output");
const gameAnswerInput = document.getElementById("game-answer-input");
const submitGameAnswerBtn = document.getElementById("submit-game-answer-btn");

// Sanal Tatil Planı
const virtualCityInput = document.getElementById("virtual-city");
const virtualDaysInput = document.getElementById("virtual-days");
const virtualDurationMinutesInput = document.getElementById("virtual-duration-minutes");
const virtualActivitiesInput = document.getElementById("virtual-activities");
const virtualImagePromptInput = document.getElementById("virtual-image-prompt");
const virtualTourCostEl = document.getElementById("virtual-tour-cost");
const startVirtualBtn = document.getElementById("start-virtual-btn");
const virtualHolidayOutput = document.getElementById("virtual-holiday-output");
const virtualOutputTitle = document.getElementById("virtual-output-title");
const virtualOutputStory = document.getElementById("virtual-output-story");
const virtualImagesContainer = document.getElementById("virtual-images-container");
const sendVirtualImageEmailBtn = document.getElementById("send-virtual-image-email-btn");
const virtualLoading = document.getElementById("virtual-loading");

// AI Fotoğraf Stüdyosu
const aiPhotoAccessCheck = document.getElementById("ai-photo-access-check");
const goToAiPhotoPaymentBtn = document.getElementById("go-to-ai-photo-payment-btn");
const aiPhotoFormArea = document.getElementById("ai-photo-form-area");
const aiPhotoPromptInput = document.getElementById("ai-photo-prompt");
const aiPhotoStyleSelect = document.getElementById("ai-photo-style");
const aiPhotoCountInput = document.getElementById("ai-photo-count");
const generateAiPhotoButton = document.getElementById("generate-ai-photo-btn");
const aiPhotoLoading = document.getElementById("ai-photo-loading");
const aiPhotoOutput = document.getElementById("ai-photo-output");
const generatedImagesContainer = document.getElementById("generated-images-container");
const downloadAllImagesBtn = document.getElementById("download-all-images-btn");
const downloadAllCostSpan = document.getElementById("download-all-cost");

// VIP Planlayıcı
const vipAccessCheck = document.getElementById("vip-access-check");
const goToVipPaymentBtn = document.getElementById("go-to-vip-payment-btn");
const vipPlannerFormArea = document.getElementById("vip-planner-form-area");
const vipDestinationInput = document.getElementById("vip-destination");
const vipDurationInput = document.getElementById("vip-duration");
const vipTravelersInput = document.getElementById("vip-travelers"); // Düzeltildi
const vipBudgetButtons = document.querySelectorAll("#vip-planner-section .budget-options button");
const vipTypeSelect = document.getElementById("vip-type");
const generateVipPlanBtn = document.getElementById("generate-vip-plan-btn");
const vipPlannerLoading = document.getElementById("vip-planner-loading");
const vipPlanOutput = document.getElementById("vip-plan-output");
let selectedBudget = "";
const vipPlanChatArea = document.getElementById("vip-plan-chat-area");
const vipPlanChatBox = document.getElementById("vip-plan-chat-box");
const vipPlanInput = document.getElementById("vip-plan-input");
const sendVipPlanMessageBtn = document.getElementById("send-vip-plan-message-btn");

// Niş Tur Talebi
const nicheTopicInput = document.getElementById("niche-topic");
const nicheDetailsTextarea = document.getElementById("niche-details");
const generateNichePlanBtn = document.getElementById("generate-niche-plan-btn");
const nichePlanLoading = document.getElementById("niche-plan-loading");
const nichePlanOutput = document.getElementById("niche-plan-output");

// Kullanıcı Bilgileri
const displayUserId = document.getElementById("display-userid");
const displayUsername = document.getElementById("display-username"); // Düzeltildi
const displayUserEmail = document.getElementById("display-user-email");
const setuserEmailBtn = document.getElementById("set-user-email-btn");
const displayTatilpuan = document.getElementById("display-tatilpuan");
const displayMembershipLevel = document.getElementById("display-membership-level");
const displayGameScore = document.getElementById("display-game-score");
const updateUsernameBtn = document.getElementById("update-username-btn");
const palmCoinHistoryList = document.getElementById("palmcoin-history-list");

// Yönetici Mesajı
const adminMessageInput = document.getElementById("admin-message-input");
const updateAdminMessageBtn = document.getElementById("update-admin-message-btn");
const adminMessageLoading = document.getElementById("admin-message-loading");
const adminDisplayMessageEl = document.getElementById("admin-display-message");

// Zamanda Yolculuk
const timeTravelAccessCheck = document.getElementById("time-travel-access-check");
const goToTimeTravelPaymentBtn = document.getElementById("go-to-time-travel-payment-btn");
const timeTravelFormArea = document.getElementById("time-travel-form-area");
const timeTravelEraInput = document.getElementById("time-travel-era");
const timeTravelDurationInput = document.getElementById("time-travel-duration");
const timeTravelCharacterInput = document.getElementById("time-travel-character");
const timeTravelFocusInput = document.getElementById("time-travel-focus"); // Düzeltildi
const startTimeTravelBtn = document.getElementById("start-time-travel-btn"); // Düzeltildi
const timeTravelLoading = document.getElementById("time-travel-loading");
const timeTravelOutput = document.getElementById("time-travel-output");

// Kader Rotası
const destinyAgeInput = document.getElementById("destiny-age");
const destinyHobbyInput = document.getElementById("destiny-hobby");
const destinyDreamInput = document.getElementById("destiny-dream"); // Düzeltildi
const destinyColorInput = document.getElementById("destiny-color");
const predictDestinyBtn = document.getElementById("predict-destiny-btn");
const destinyLoading = document.getElementById("destiny-loading");
const destinyRouteOutput = document.getElementById("destiny-route-output");
const realizeDestinyBtn = document.getElementById("realize-destiny-btn");

// AI Yoldaşım
const companionNameInput = document.getElementById("companion-name");
const companionPersonalitySelect = document.getElementById("companion-personality");
const createCompanionBtn = document.getElementById("create-companion-btn");
const companionChatArea = document.getElementById("companion-chat-area");
const activeCompanionName = document.getElementById("active-companion-name");
const companionChatBox = document.getElementById("companion-chat-box");
const companionInput = document.getElementById("companion-input");
    const sendCompanionMessageBtn = document.getElementById("send-companion-message-btn");
const companionLoading = document.getElementById("companion-loading");

// Ödeme
const cardNumberInput = document.getElementById("card-number");
const expiryDateInput = document.getElementById("expiry-date");
const cvvInput = document.getElementById("cvv");
const cardHolderNameInput = document.getElementById("card-holder-name");
const completePaymentBtn = document.getElementById("complete-payment-btn");

// Bize Ulaşın Bölümü
const contactSubjectInput = document.getElementById('contact-subject');
const contactEmailInput = document.getElementById('contact-email');
const contactMessageInput = document.getElementById('contact-message'); // Düzeltildi
const contactFileInput = document.getElementById('contact-file');
const sendContactFormBtn = document.getElementById('send-contact-form-btn');
const contactLoading = document.getElementById('contact-loading');


// --- Uygulama Başlangıcı ve Genel Fonksiyonlar ---
window.initializeAppFeatures = function() {
    // Slogan güncellemesi DOMContentLoaded içinde başlatılıyor, burada sadece bir işaretleyici olarak kaldı
};

// Modalları gizlemek için yardımcı fonksiyon
function hideModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = "none";
    }
}
window.hideModal = hideModal;

// --- Firebase Authentication ve Kullanıcı Durumu ---
auth.onAuthStateChanged(async (user) => {
    const mainLayout = document.querySelector('.main-layout');
    if (user) {
        currentUserId = user.uid;
        if (authButtons) authButtons.style.display = 'none';
        if (loggedInUserSection) loggedInUserSection.style.display = 'flex';
        if (usernameDisplay) usernameDisplay.textContent = user.displayName || user.email;
        if (mainLayout) {
            mainLayout.style.display = 'flex';
        }
        await loadUserProfile(); // Kullanıcı girişi sonrası profili yükle
        loadAdminMessage(); // Yönetici mesajını yükle
        loadAds(); // Reklamları yükle
    } else {
        currentUserId = null;
        if (authButtons) authButtons.style.display = 'flex';
        if (loggedInUserSection) loggedInUserSection.style.display = 'none';
        // Kullanıcı bilgilerini sıfırla
        userName = "Misafir";
        tatilPuan = 0;
        userMembershipLevel = "Bronz";
        gameScore = 0;
        userEmail = "Ayarlanmadı";
        palmCoinHistory = [];
        displayMembershipInfo();
        updateTatilPuanDisplay();
        updatePalmCoinHistoryDisplay();
        if (userIdDisplay) userIdDisplay.textContent = `UID: ${currentUserId || 'Misafir'}`;
        if (mainLayout) {
            mainLayout.style.display = 'flex'; // Giriş yapılmasa bile ana düzeni göster (ücretsiz özellikler için)
        }
        // Açık tüm modalları kapat
        hideModal(loginModal);
        hideModal(registerModal);
        hideModal(forgotPasswordModal);
        loadAds(); // Çıkış yapıldığında da reklamları yükle
    }
});

// --- Firebase Kullanıcı Verileri Fonksiyonları ---
window.getUserProfileRef = function() {
    if (!firestore || !currentUserId) {
        console.warn("Firestore veya Kullanıcı ID'si hazır değil. Profil referansı alınamıyor.");
        return null;
    }
    return firestore.collection('users').doc(currentUserId);
};

window.loadUserProfile = async function() {
    const profileRef = window.getUserProfileRef();
    if (!profileRef) {
        console.log("Profil referansı mevcut değil, varsayılan bilgiler gösteriliyor.");
        window.displayMembershipInfo();
        window.updateTatilPuanDisplay();
        if (userIdDisplay) userIdDisplay.textContent = `UID: ${currentUserId || 'Misafir'}`;
        return;
    }

    profileRef.onSnapshot((docSnap) => {
        if (docSnap.exists) {
            const data = docSnap.data();
            userName = data.username || auth.currentUser.displayName || "Misafir";
            tatilPuan = data.tatilPuanlari || 0;
            userMembershipLevel = data.membershipLevel || "Bronz";
            gameScore = data.gameScore || 0;
            userEmail = data.email || auth.currentUser.email || "Ayarlanmadı";
            palmCoinHistory = data.palmCoinHistory || [{ timestamp: new Date().toISOString(), type: "Başlangıç", amount: 0, current: 0 }];
            console.log("Kullanıcı profili yüklenirken hata:", data);
        } else {
            console.log("Kullanıcı profili bulunamadı, varsayılan oluşturuluyor.");
            // Profil yoksa varsayılan profil oluştur. Bu ideal olarak kullanıcı kaydında gerçekleşmeli.
            // Sadece kullanıcı giriş yapmışsa oluştur.
            if (auth.currentUser) {
                window.updateUserProfile({
                    username: auth.currentUser.displayName || auth.currentUser.email,
                    email: auth.currentUser.email,
                    tatilPuanlari: 0,
                    membershipLevel: "Bronz",
                    gameScore: 0,
                    palmCoinHistory: [{ timestamp: new Date().toISOString(), type: "Başlangıç", amount: 0, current: 0 }]
                });
            }
        }
        window.displayMembershipInfo();
        window.updateTatilPuanDisplay();
        window.updatePalmCoinHistoryDisplay();
        if (userIdDisplay) userIdDisplay.textContent = `UID: ${currentUserId || 'Misafir'}`;
    }, (error) => {
        console.error("Kullanıcı profili yüklenirken hata:", error);
        window.showModal("Hata", `Kullanıcı verileri yüklenirken bir sorun oluştu: ${error.message}.`);
    });
};

window.updateUserProfile = async function(dataToUpdate) {
    const profileRef = window.getUserProfileRef();
    if (!profileRef) {
        console.error("Profil referansı mevcut değil, güncelleme yapılamıyor.");
        return;
    }
    try {
        await profileRef.set(dataToUpdate, { merge: true });
        console.log("Kullanıcı profili güncellendi:", dataToUpdate);
    } catch (error) {
        console.error("Kullanıcı verileri kaydedilirken bir sorun oluştu: ${error.message}.");
        window.showModal("Hata", `Kullanıcı verileri kaydedilirken bir sorun oluştu: ${error.message}.`);
    }
};

// --- Firebase İlan ve Yönetici Mesajı Yönetimi Fonksiyonları ---
window.loadAds = async function() {
    const dynamicAdsContainer = document.getElementById('dynamic-ads-container');
    if (!dynamicAdsContainer) return;

    // Başlangıçta tüm statik/varsayılan ilan bloklarını temizle
    dynamicAdsContainer.innerHTML = ''; 

    try {
        // Firestore'dan dinamik reklamları yükleme (Örnek)
        const adsSnapshot = await firestore.collection('ads').get();
        if (!adsSnapshot.empty) {
            adsSnapshot.forEach(doc => {
                const ad = doc.data();
                const adElement = document.createElement('a');
                adElement.href = ad.url || '#';
                adElement.target = '_blank';
                adElement.classList.add('ad-area-dynamic');
                adElement.innerHTML = `<img src="${ad.imageUrl || 'https://placehold.co/150x100/eeeeee/aaaaaa?text=Reklam'}" alt="${ad.title || 'Reklam'}">
                                       <p>${ad.text || 'Dinamik Reklam'}</p>`;
                dynamicAdsContainer.appendChild(adElement);
            });
        } else {
            // Dinamik reklam yoksa varsayılan mesajı göster
            const defaultAdElement = document.createElement('div');
            defaultAdElement.classList.add('ad-area-dynamic', 'default-ad-block');
            defaultAdElement.style.cssText = "background-color: rgba(224, 242, 241, 0.3); border-color: rgba(0, 189, 212, 0.3); color: #004d40; border: 1px dashed;"; // Daha şeffaf
            defaultAdElement.innerHTML = `
                <i class="fas fa-bullhorn" style="font-size: 2em; margin-bottom: 10px; color: #0097a7;"></i>
                <p>Burada sizin ilanınız olabilir! <br>İlan vermek için bize e-posta gönderin.</p>
                <a href="mailto:info@tatilkaptani.com" style="color: #00796b; font-weight: bold;">info@tatilkaptani.com</a>
            `;
            dynamicAdsContainer.appendChild(defaultAdElement);
        }
    } catch (error) {
        console.error("Dinamik reklamlar yüklenirken hata:", error);
        // Hata durumunda da varsayılan mesajı göster
        const defaultAdElement = document.createElement('div');
        defaultAdElement.classList.add('ad-area-dynamic', 'default-ad-block');
        defaultAdElement.style.cssText = "background-color: rgba(224, 242, 241, 0.3); border-color: rgba(0, 189, 212, 0.3); color: #004d40; border: 1px dashed;"; // Daha şeffaf
        defaultAdElement.innerHTML = `
            <i class="fas fa-bullhorn" style="font-size: 2em; margin-bottom: 10px; color: #0097a7;"></i>
            <p>Reklamlar yüklenemedi. <br>Lütfen daha sonra tekrar deneyin.</p>
            <a href="mailto:info@tatilkaptani.com" style="color: #00796b; font-weight: bold;">info@tatilkaptani.com</a>
        `;
        dynamicAdsContainer.appendChild(defaultAdElement);
    }
};

// Yönetici Mesajını Yükleme (Artık Firebase Cloud Function üzerinden çağrılıyor)
window.loadAdminMessage = async function() {
    if (!adminDisplayMessageEl || !adminDisplayMessageEl.querySelector('p')) {
        console.error("Yönetici mesajı görüntüleme elementi bulunamadı.");
        return;
    }

    try {
        // Firebase Cloud Function'ı çağır
        const getAdminMessageCallable = functions.httpsCallable('getAdminMessage');
        const result = await getAdminMessageCallable();

        adminDisplayMessageEl.querySelector('p').textContent = result.data.message || "Yönetici mesajı bulunmamaktadır.";
    } catch (error) {
        console.error("Yönetici mesajı yüklenirken hata:", error);
        let errorMessage = `Yönetici mesajı yüklenemedi: ${error.message}.`;
        adminDisplayMessageEl.querySelector('p').textContent = errorMessage;
    }
};

// Yönetici Mesajını Güncelleme (Artık Firebase Cloud Function üzerinden çağrılıyor)
window.updateAdminMessage = async function(message) {
    const adminMessageLoadingEl = document.getElementById("admin-message-loading");
    if (adminMessageLoadingEl) adminMessageLoadingEl.style.display = 'block';

    try {
        // HTTPS Callable fonksiyonunu çağır
        const updateAdminMessageCallable = functions.httpsCallable('updateAdminMessage');
        const result = await updateAdminMessageCallable({ message: message });

        console.log("Yönetici mesajı başarıyla güncellendi (Backend ile):", result.data.message);
        window.showModal("Başarılı", result.data.message);
    } catch (error) {
        console.error("Yönetici mesajı güncellenirken hata:", error);
        let errorMessage = `Yönetici mesajı güncellenirken bir sorun oluştu: ${error.message}.`;
        // Yetki hatası özel mesajı
        if (error.code === 'permission-denied') {
            errorMessage = "Bu işlemi yapmaya yetkiniz yok. Yönetici izni gereklidir.";
        } else if (error.code === 'unauthenticated') {
            errorMessage = "Giriş yapmanız gerekiyor. Yönetici mesajını güncellemek için.";
        }
        window.showModal("Hata", errorMessage);
    } finally {
        if (adminMessageLoadingEl) adminMessageLoadingEl.style.display = 'none';
    }
};

// --- Genel UI ve Yardımcı Fonksiyonlar ---
window.showModal = function(title, message) {
    const modal = document.getElementById("appModal");
    const modalTitleEl = document.getElementById("modalTitle");
    const modalMessageEl = document.getElementById("modalMessage");
    const modalConfirmBtnEl = document.getElementById("modalConfirmBtn");

    if (!modal || !modalTitleEl || !modalMessageEl || !modalConfirmBtnEl) {
        console.error("Modal elementleri bulunamadı. Modal gösterilemiyor.");
        return Promise.resolve(false);
    }

    modalTitleEl.textContent = title;
    modalMessageEl.innerHTML = message;
    modal.style.display = "flex";

    const oldConfirmListener = modalConfirmBtnEl._eventListener;
    if (oldConfirmListener) {
        modalConfirmBtnEl.removeEventListener("click", oldConfirmListener);
    }

    return new Promise((resolve) => {
        const handleConfirm = () => {
            modal.style.display = "none";
            modalConfirmBtnEl.removeEventListener("click", handleConfirm);
            modalConfirmBtnEl._eventListener = null;
            resolve(true);
        };
        modalConfirmBtnEl.addEventListener("click", handleConfirm);
        modalConfirmBtnEl._eventListener = handleConfirm;
    });
};

window.displayMessage = function(sender, text, chatBoxElement = chatBox) {
    if (!chatBoxElement) {
        console.error("Sohbet kutusu elementi bulunamadı.");
        return;
    }
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    const span = document.createElement('span');
    span.textContent = text;
    messageDiv.appendChild(span);
    chatBoxElement.appendChild(messageDiv);
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
    // Sohbet kutusu otomatik olarak alta kaydırılır
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
};

window.speak = function(text) {
    const languageSelectEl = document.getElementById("language-select");
    if (!languageSelectEl || !voiceEnabled || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageSelectEl.value + "-" + languageSelectEl.value.toUpperCase();
    speechSynthesis.speak(utterance);
};

window.updateTatilPuan = async function(points, activity = "Genel Aktivite") {
    tatilPuan += points;
    palmCoinHistory.push({
        timestamp: new Date().toISOString(),
        type: points > 0 ? "Kazanıldı" : "Harcandı",
        activity: activity,
        amount: Math.abs(points),
        current: tatilPuan
    });

    if (palmCoinHistory.length > 20) {
        palmCoinHistory = palmCoinHistory.slice(palmCoinHistory.length - 20);
    }

    const oldLevel = userMembershipLevel;
    if (tatilPuan < 100) {
        userMembershipLevel = "Bronz";
    } else if (tatilPuan < 200) {
        userMembershipLevel = "Gümüş";
    } else {
        userMembershipLevel = "Altın";
    }

    if (currentUserId) {
        await window.updateUserProfile({
            tatilPuanlari: tatilPuan,
            membershipLevel: userMembershipLevel,
            palmCoinHistory: palmCoinHistory,
            gameScore: gameScore
        });
    }

    if (oldLevel !== userMembershipLevel) {
        window.showModal("Tebrikler!", `Üyelik seviyeniz **${userMembershipLevel}** seviyesine yükseldi! Yeni özelliklere göz atın.`);
        window.speak(`Tebrikler! Üyelik seviyeniz ${userMembershipLevel} seviyesine yükseldi!`);
    }
    window.updatePalmCoinHistoryDisplay();
    window.updateTatilPuanDisplay();
};

window.updateTatilPuanDisplay = function() {
    if (tatilpuanTop) {
        tatilpuanTop.innerHTML = `<i class="fas fa-star"></i> TatilPuan: ${tatilPuan} (${userMembershipLevel})`;
    }
    if (displayTatilpuan) displayTatilpuan.textContent = tatilPuan;
    if (displayMembershipLevel) displayMembershipLevel.textContent = userMembershipLevel;
};

window.displayMembershipInfo = function() {
    if (displayUserId) displayUserId.textContent = currentUserId || "Yükleniyor...";
    if (displayUsername) displayUsername.textContent = userName;
    if (displayUserEmail) displayUserEmail.textContent = userEmail;
    if (displayTatilpuan) displayTatilpuan.textContent = tatilPuan;
    if (displayMembershipLevel) displayMembershipLevel.textContent = userMembershipLevel;
    if (displayGameScore) displayGameScore.textContent = gameScore;
    if (userIdDisplay) userIdDisplay.textContent = `UID: ${currentUserId || 'Misafir'}`;
};

window.updatePalmCoinHistoryDisplay = function() {
    if (!palmCoinHistoryList) return;
    palmCoinHistoryList.innerHTML = '';
    palmCoinHistory.slice().reverse().forEach(entry => {
        const listItem = document.createElement("li");
        const date = new Date(entry.timestamp).toLocaleString();
        let color = '#333';
        if (entry.type === "Kazanıldı") {
            color = 'green';
        } else if (entry.type === "Harcandı") {
            color = 'red';
        }
        listItem.innerHTML = `<span style="color:${color};"><strong>${entry.type}:</strong> ${entry.amount} PalmCoin</span> - ${entry.activity} (${date}) - Toplam: ${entry.current}`;
        palmCoinHistoryList.appendChild(listItem);
    });
};

window.showSection = function(sectionId) {
    contentSections.forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add("active");
        activeSection.style.display = "flex";
    }

    // Sidebar butonlarının olay dinleyicileri sadece bir kez DOMContentLoaded içinde atanmalı
    // Bu fonksiyon her çağrıldığında tekrar atanmamalı.

    if (sectionId === "vip-planner-section") {
        window.checkVipAccess(document.getElementById("vip-access-check"), document.getElementById("vip-planner-form-area"), "Altın");
        window.checkVipAccess(document.getElementById("vip-access-check"), document.getElementById("niche-vip-request-area"), "Altın");
        if (vipPlanChatArea) vipPlanChatArea.style.display = 'none';
        if (vipPlanOutput) vipPlanOutput.style.display = 'none';
        currentVipPlan = "";
    } else if (sectionId === "time-travel-section") {
        window.checkVipAccess(document.getElementById("time-travel-access-check"), document.getElementById("time-travel-form-area"), "Altın");
    } else if (sectionId === "ai-photo-studio-section") {
        window.checkVipAccess(document.getElementById("ai-photo-access-check"), document.getElementById("ai-photo-form-area"), "Altın");
        if (generatedImagesContainer) generatedImagesContainer.innerHTML = '';
        if (downloadAllImagesBtn) downloadAllImagesBtn.style.display = 'none';
        if (aiPhotoOutput) aiPhotoOutput.style.display = 'none';
        currentGeneratedImages = [];
    } else if (sectionId === "user-info-section") {
        window.displayMembershipInfo();
        window.loadAdminMessage();
        window.updatePalmCoinHistoryDisplay();
    } else if (sectionId === "payment-section") {
        if (cardNumberInput) cardNumberInput.value = '';
        if (expiryDateInput) expiryDateInput.value = '';
        if (cvvInput) cvvInput.value = '';
        if (cardHolderNameInput) cardHolderNameInput.value = '';
    } else if (sectionId === "virtual-holiday-section") {
        if (virtualDurationMinutesInput && virtualTourCostEl) {
            virtualTourCostEl.textContent = (parseInt(virtualDurationMinutesInput.value) * VIRTUAL_TOUR_COST_PER_MINUTE);
        }
        if (virtualHolidayOutput) virtualHolidayOutput.style.display = "none";
        if (virtualImagesContainer) virtualImagesContainer.innerHTML = '';
        if (sendVirtualImageEmailBtn) sendVirtualImageEmailBtn.style.display = 'none';
        generatedVirtualImageUrl = '';
    } else if (sectionId === "destiny-route-section") {
        if (destinyRouteOutput) destinyRouteOutput.style.display = "none";
        if (realizeDestinyBtn) realizeDestinyBtn.style.display = "none";
    }
    if (sectionId === "contact-us-section") {
        if (contactSubjectInput) contactSubjectInput.value = '';
        if (contactEmailInput) contactEmailInput.value = userEmail !== "Ayarlanmadı" ? userEmail : '';
        if (contactMessageInput) contactMessageInput.value = '';
        if (contactFileInput) contactFileInput.value = '';
    }
};

window.checkVipAccess = function(accessCheckEl, formAreaEl, requiredLevel) {
    const levels = ["Bronz", "Gümüş", "Altın"];
    const currentUserLevelIndex = levels.indexOf(userMembershipLevel);
    const requiredLevelIndex = levels.indexOf(requiredLevel);

    if (currentUserLevelIndex >= requiredLevelIndex) {
        if (accessCheckEl) accessCheckEl.style.display = "none";
        if (formAreaEl) formAreaEl.style.display = "block";
    } else {
        if (accessCheckEl) accessCheckEl.style.display = "block";
        if (formAreaEl) formAreaEl.style.display = "none";
    }
};

// OpenRouter AI Çağrısı (Artık backend fonksiyonu üzerinden HTTPS Callable ile)
window.callOpenRouterAI = async function(prompt, model = "openai/gpt-3.5-turbo", loadingIndicator = null, currentChatHistory = []) {
    if (loadingIndicator) loadingIndicator.style.display = "block";
    try {
        // Doğru Firebase Project ID'nizi burada kullanmalısınız.
        // Bu URL, Firebase Console'da Cloud Functions bölümünde bulunur.
        const firebaseFunctionsUrl = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/callOpenRouterAI`;
        const response = await fetch(firebaseFunctionsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { prompt, model, chatHistory } }) // Data objesi Cloud Function'a uygun şekilde gönderilir
        });
        const result = await response.json();

        if (response.ok && result.data && result.data.reply) {
            return result.data.reply;
        } else {
            throw new Error(result.data?.message || 'AI yanıtı alınamadı.');
        }
    } catch (error) {
        console.error("Cloud Function 'callOpenRouterAI' çağrılırken hata:", error);
        window.showModal("AI Hatası!", `AI ile iletişim kurulurken bir sorun oluştu: ${error.message}. Lütfen daha sonra tekrar deneyin.`);
        return `Bir hata oluştu: ${error.message}`;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = "none";
    }
};

// Google Gemini Görsel Oluşturma Çağrısı (Artık backend fonksiyonu üzerinden HTTPS Callable ile)
window.callImageGenerationAI = async function(promptText, loadingIndicator = null) {
    if (loadingIndicator) loadingIndicator.style.display = "block";
    try {
        const firebaseFunctionsUrl = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/callImageGenerationAI`;
        const response = await fetch(firebaseFunctionsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { promptText } })
        });
        const result = await response.json();

        if (response.ok && result.data && result.data.imageUrl) {
            return result.data.imageUrl; // Backend'den gelen imageUrl'ı döndür
        } else {
            throw new Error(result.data?.message || 'Görsel yanıtı alınamadı.');
        }
    } catch (error) {
        console.error("Cloud Function 'callImageGenerationAI' çağrılırken hata:", error);
        window.showModal("Görsel Oluşturma Hatası!", `Görsel oluşturulurken bir sorun oluştu: ${error.message}.`);
        return `Bir hata oluştu: ${error.message}`;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = "none";
    }
};

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    window.initializeAppFeatures();

    // Slogan güncelleme fonksiyonu ve çağrıları
    function updateSlogan() {
        if (sloganTop) {
            sloganTop.textContent = sloganList[currentSloganIndex];
        }
        currentSloganIndex = (currentSloganIndex + 1) % sloganList.length;
    }
    setInterval(updateSlogan, 5000);
    updateSlogan(); // Sayfa yüklendiğinde ilk sloganı hemen göster

    sidebarButtons.forEach(button => {
        button.addEventListener("click", () => {
            const sectionId = button.dataset.section;
            window.showSection(sectionId);
        });
    });

    sendChatBtn.onclick = async () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        window.displayMessage("user", userMessage, chatBox);
        chatHistory.push({ role: "user", content: userMessage });
        chatInput.value = "";

        const selectedLanguage = languageSelect.value;
        const languagePrompt = `in ${selectedLanguage === 'tr' ? 'Turkish' : 'English'}`; // Daha güçlü dil istemi

        const promptForAI = `You are a helpful travel assistant called "Palmiye Kaptan". User's message: "${userMessage}".
                            Respond ${languagePrompt}.
                            Provide creative, informative, and personalized assistance on topics like travel, destinations, accommodation, activities, budget planning, virtual tours, historical sites, and cultural experiences.
                            Avoid repetitive or generic answers. Understand the context by considering previous messages in the chat history.
                            If the user's message clearly indicates a feature request (e.g., 'I want to play a game', 'plan a trip', 'generate an image', 'I want to be VIP', 'set email', 'set admin message'),
                            add a hidden tag at the end of your response in the format "[YÖNLENDİR: [section-name]]".
                            Example: "Elbette, size özel bir tatil planı oluşturabilirim! [YÖNLENDİR: vip-planner-section]".
                            Section names: game-section, virtual-holiday-section, ai-photo-studio-section, vip-planner-section, user-info-section, time-travel-section, destiny-route-section, ai-companion-section, payment-section, contact-us-section.
                            Your response should be friendly and engaging.`;

        const chatHistoryForAI = chatHistory.slice(Math.max(chatHistory.length - 10, 0));

        const reply = await window.callOpenRouterAI(promptForAI, "openai/gpt-3.5-turbo", chatLoading, chatHistoryForAI);
        const redirectMatch = reply.match(/\[YÖNLENDİR:\s*([^\]]+)\]/);
        let cleanReply = reply.replace(/\[YÖNLENDİR:\s*([^\]]+)\]/, '').trim();

        window.displayMessage("ai", cleanReply, chatBox);
        chatHistory.push({ role: "assistant", content: cleanReply });
        window.speak(cleanReply);
        window.updateTatilPuan(5, "Sohbet");

        if (currentUserId) {
            try {
                await firestore.collection('users').doc(currentUserId).collection('chatHistory').add({
                    userMessage: userMessage,
                    aiReply: cleanReply,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (e) {
                console.error("Sohbet geçmişi Firestore'a kaydedilirken hata:", e);
            }
        }

        if (redirectMatch && redirectMatch[1]) {
            const targetSectionId = redirectMatch[1].trim();
            const sectionNameMap = {
                "game-section": "Tatil Avı (Oyun)",
                "virtual-holiday-section": "Sanal Tatil Planı",
                "ai-photo-studio-section": "AI Fotoğraf Stüdyosu",
                "vip-planner-section": "VIP A'dan Z'ye Tur Planlayıcı",
                "user-info-section": "Üyelik Bilgileri",
                "time-travel-section": "Zamanda Yolculuk Tatili",
                "destiny-route-section": "Kader Rotası",
                "ai-companion-section": "AI Yoldaşım",
                "payment-section": "VIP Üyelik Al",
                "contact-us-section": "Bize Ulaşın"
            };
            const friendlySectionName = sectionNameMap[targetSectionId] || targetSectionId;

            window.showModal(
                "Yönlendirme Önerisi",
                `Palmiye Kaptan, sanırım **${friendlySectionName}** bölümüyle ilgileniyorsunuz. Oraya gitmek ister misiniz?` +
                `<br><br><button id="confirmRedirectBtn" style="background-color:#00796b; color:white; padding:10px 20px; border:none; border-radius:5px; cursor:pointer;">Evet, Git!</button>` +
                `<button id="cancelRedirectBtn" style="background-color:#ccc; color:#333; padding:10px 20px; border:none; border-radius:5px; cursor:pointer; margin-left: 10px;">Hayır, Burada Kal</button>`
            );

            const confirmRedirectBtn = document.getElementById("confirmRedirectBtn");
            const cancelRedirectBtn = document.getElementById("cancelRedirectBtn");

            if (confirmRedirectBtn) {
                confirmRedirectBtn.onclick = () => {
                    window.showSection(targetSectionId);
                    hideModal(appModal);
                };
            }
            if (cancelRedirectBtn) {
                cancelRedirectBtn.onclick = () => {
                    hideModal(appModal);
                };
            }
        }
    };

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChatBtn.click();
    });

    voiceToggleTop.onclick = () => {
        const newState = !voiceEnabled;
        voiceEnabled = newState;
        voiceToggleTop.innerHTML = voiceEnabled ? '<i class="fas fa-volume-up"></i> Ses: Açık' : '<i class="fas fa-volume-mute"></i> Ses: Kapalı';
        if (voiceEnabled) {
            window.speak("Sesli yanıtlar açıldı.");
        } else {
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        }
    };

    languageSelect.addEventListener("change", () => {
        window.showModal("Dil Değişikliği", `Dil ${languageSelect.options[languageSelect.selectedIndex].text} olarak ayarlandı. AI bu dilde yanıt vermeye çalışacak.`);
        window.speak(`Language changed to ${languageSelect.options[languageSelect.selectedIndex].text}.`);
    });

    // avatarEl.addEventListener('click', () => window.showSection("user-info-section")); // Avatar kaldırıldığı için kaldırıldı
    modalConfirmBtn.addEventListener("click", () => hideModal(appModal));

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            hideModal(registerModal);
            hideModal(forgotPasswordModal);
            if (loginModal) loginModal.style.display = 'flex';
        });
    }
    if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                hideModal(loginModal);
                hideModal(forgotPasswordModal);
                if (registerModal) registerModal.style.display = 'flex';
            });
        }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', () => {
                hideModal(loginModal);
                if (forgotPasswordModal) forgotPasswordModal.style.display = 'flex';
            });
        }

        closeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                hideModal(event.target.closest('.modal'));
            });
        });

        window.addEventListener('click', (event) => {
            if (event.target == loginModal) hideModal(loginModal);
            if (event.target == registerModal) hideModal(registerModal);
            if (event.target == forgotPasswordModal) hideModal(forgotPasswordModal);
            if (event.target == appModal) hideModal(appModal);
        });

        performRegisterBtn.addEventListener('click', async () => {
            const username = registerUsernameInput.value.trim();
            const email = registerEmailInput.value.trim();
            const password = registerPasswordInput.value.trim();

            if (!username || !email || !password) {
                registerMessage.textContent = 'Lütfen tüm alanları doldurun.';
                registerMessage.style.color = 'red';
                return;
            }
            if (password.length < 6) {
                registerMessage.textContent = 'Şifre en az 6 karakter olmalıdır.';
                registerMessage.style.color = 'red';
                return;
            }

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({ displayName: username });

                await firestore.collection('users').doc(userCredential.user.uid).set({
                    username: username,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    tatilPuanlari: 0,
                    membershipLevel: 'Bronz',
                    gameScore: 0,
                    palmCoinHistory: [{ timestamp: new Date().toISOString(), type: "Başlangıç", amount: 0, current: 0 }]
                });

                registerMessage.textContent = 'Kayıt başarılı! Hoş geldiniz. Şimdi giriş yapabilirsiniz.';
                registerMessage.style.color = 'green';

                // Hoş geldin e-postasını göndermek için Cloud Function'ı çağır
                const sendWelcomeEmailCallable = functions.httpsCallable('sendWelcomeEmail');
                sendWelcomeEmailCallable({ email: email, username: username })
                    .then(result => {
                        console.log("Hoş geldin e-postası Cloud Function yanıtı:", result.data.message);
                    })
                    .catch(error => {
                        console.error("Hoş geldin e-postası Cloud Function çağrılırken hata:", error);
                        // Kullanıcıya e-posta gönderim hatası hakkında bilgi verebilirsiniz.
                    });

                setTimeout(() => {
                    hideModal(registerModal);
                    if (loginModal) loginModal.style.display = 'flex';
                    if (loginEmailInput) loginEmailInput.value = email;
                }, 2000);
            } catch (error) {
                let errorMessage = 'Kayıt sırasında bir hata oluştu.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'Bu e-posta adresi zaten kullanımda.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Şifre en az 6 karakter olmalıdır.';
                } else {
                    errorMessage = error.message;
                }
                registerMessage.textContent = errorMessage;
                registerMessage.style.color = 'red';
                console.error('Kayıt hatası:', error);
            }
        });

        performLoginBtn.addEventListener('click', async () => {
            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (!email || !password) {
                loginMessage.textContent = 'Lütfen tüm alanları doldurun.';
                loginMessage.style.color = 'red';
                return;
            }

            try {
                await auth.signInWithEmailAndPassword(email, password);
                loginMessage.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';
                loginMessage.style.color = 'green';
                setTimeout(() => {
                    hideModal(loginModal);
                }, 1500);
            } catch (error) {
                let errorMessage = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
                if (error.code === 'auth/wrong-password') {
                    errorMessage = 'E-posta veya şifre hatalı.';
                } else if (error.code === 'auth/user-not-found') {
                    errorMessage = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
                } else {
                    errorMessage = error.message;
                }
                loginMessage.textContent = errorMessage;
                loginMessage.style.color = 'red';
                console.error('Giriş hatası:', error);
            }
        });

        performResetBtn.addEventListener('click', async () => {
            const email = resetEmailInput.value.trim();
            if (!email) {
                resetMessage.textContent = 'Lütfen tüm alanları doldurun.';
                resetMessage.style.color = 'red';
                return;
            }

            try {
                await auth.sendPasswordResetEmail(email);
                resetMessage.textContent = 'Şifre sıfırlama linki e-posta adresinize gönderildi.';
                resetMessage.style.color = 'green';
                setTimeout(() => hideModal(forgotPasswordModal), 3000);
            } catch (error) {
                let errorMessage = 'Şifre sıfırlama isteği gönderilirken bir hata oluştu.';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
                } else {
                    errorMessage = error.message;
                }
                resetMessage.textContent = errorMessage;
                resetMessage.style.color = 'red';
                console.error('Şifre sıfırlama hatası:', error);
            }
        });

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await auth.signOut();
                    window.showModal('Çıkış Başarılı', 'Başarıyla çıkış yaptınız.');
                } catch (error) {
                    console.error('Çıkış yaparken hata:', error);
                    window.showModal('Hata', 'Çıkış yaparken bir hata oluştu: ' + error.message);
                }
            });
        }

        startGameBtn.onclick = () => {
            gameActive = true;
            currentQuestionIndex = 0;
            gameScore = 0;
            if (currentUserId) {
                window.updateUserProfile({ gameScore: gameScore });
            }
            gameOutput.innerHTML = `<p><strong>Palmiye Kaptan:</strong> Tatil Avı oyununa hoş geldiniz! Size 3 soru soracağım. Doğru cevap verirseniz PalmCoin kazanacaksınız!</p>`;
            gameAnswerInput.style.display = "block";
            submitGameAnswerBtn.style.display = "block";
            startGameBtn.style.display = "none";
            window.speak("Tatil Avı oyununa hoş geldiniz! Size üç soru soracağım. Doğru cevap verirseniz PalmCoin kazanacaksınız!");
            setTimeout(askNextGameQuestion, 2000);
        };

        submitGameAnswerBtn.onclick = () => handleGameAnswer(gameAnswerInput.value);
        gameAnswerInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") submitGameAnswerBtn.click();
        });

        async function askNextGameQuestion() {
            if (currentQuestionIndex < 3) {
                gameOutput.innerHTML += `<p><i class="fas fa-spinner fa-spin"></i> Palmiye Kaptan yeni soru hazırlıyor...</p>`;
                gameAnswerInput.value = "";
                gameAnswerInput.focus();
                try {
                    const aiResponse = await window.callOpenRouterAI(
                        `Create a short trivia question about travel, geography, or culture with 3 multiple-choice options (A, B, C) and a single correct answer.
                        Format the response as 'Soru: [Question Text] Seçenekler: (A) [Option A] (B) [Option B] (C) [Option C] Cevap: [Correct Option Letter (e.g.: A)]'.
                        Ensure options are clearly labeled (A), (B), (C). Provide in Turkish.`,
                        "openai/gpt-3.5-turbo",
                        null
                    );

                    const questionMatch = aiResponse.match(/Soru:\s*(.*?)\s*Seçenekler:\s*(.*?)\s*Cevap:\s*([A-C])/i);
                    if (questionMatch && questionMatch.length === 4) {
                        const questionText = questionMatch[1].trim();
                        const optionsText = questionMatch[2].trim();
                        const correctAnswer = questionMatch[3].trim().toUpperCase();

                        const optionsArray = [];
                        const optionRegex = /\(([A-C])\)\s*([^)(]+)/g;
                        let match;
                        while ((match = optionRegex.exec(optionsText)) !== null) {
                            optionsArray.push(`(${match[1].toUpperCase()}) ${match[2].trim()}`);
                        }
                        if (optionsArray.length === 0 && optionsText) {
                            const rawOptions = optionsText.split(/ \(B\) | \(C\) /).map(s => s.trim());
                            if (rawOptions[0]) optionsArray.push(`(A) ${rawOptions[0].replace('(A) ', '')}`);
                            if (rawOptions[1]) optionsArray.push(`(B) ${rawOptions[1].replace('(B) ', '')}`);
                            if (rawOptions[2]) optionsArray.push(`(C) ${rawOptions[2].replace('(C) ', '')}`);
                        }

                        currentGameQuestion = {
                            question: questionText,
                            options: optionsArray.length > 0 ? optionsArray : [optionsText],
                            answer: correctAnswer,
                            points: 20 + (currentQuestionIndex * 5)
                        };

                        gameOutput.innerHTML += `<p><strong>Palmiye Kaptan:</strong> Soru ${currentQuestionIndex + 1}: ${currentGameQuestion.question}<br>${currentGameQuestion.options.join("<br>")}</p>`;
                        window.speak(`Soru ${currentQuestionIndex + 1}: ${currentGameQuestion.question} ${currentGameQuestion.options.join(" ")}`);
                    } else {
                        gameOutput.innerHTML += `<p style="color: red;"><strong>Palmiye Kaptan:</strong> Bir sorun oluştu, soru oluşturulamadı. Lütfen tekrar deneyin. Detay: ${aiResponse}</p>`;
                        window.speak("Bir sorun oluştu, soru oluşturulamadı.");
                        endGame();
                    }
                } catch (error) {
                    console.error("Oyun sorusu oluşturulurken hata:", error);
                    gameOutput.innerHTML += `<p style="color: red;"><strong>Palmiye Kaptan:</strong> Soru oluşturulurken bir hata oluştu: ${error.message}.</p>`;
                    window.speak("Soru oluşturulurken bir hata oluştu.");
                    endGame();
                }
            } else {
                endGame();
            }
        }

        async function handleGameAnswer(answer) {
            if (!currentGameQuestion) {
                gameOutput.innerHTML += `<p style="color: red;"><strong>Palmiye Kaptan:</strong> Henüz bir soru yok. Lütfen oyunu başlatın.</p>`;
                return;
            }

            const userAnswer = answer.trim().toUpperCase();
            gameAnswerInput.value = "";

            if (userAnswer === currentGameQuestion.answer) {
                gameOutput.innerHTML += `<p style="color: green;"><strong>Palmiye Kaptan:</strong> Tebrikler! Doğru cevap. (+${currentGameQuestion.points} PalmCoin)</p>`;
                window.speak("Tebrikler! Doğru cevap.");
                gameScore += currentGameQuestion.points;
                if (currentUserId) {
                    await window.updateUserProfile({ gameScore: gameScore });
                }
                window.updateTatilPuan(currentGameQuestion.points, `Tatil Avı Oyunu (Soru ${currentQuestionIndex + 1})`);
            } else {
                gameOutput.innerHTML += `<p style="color: red;"><strong>Palmiye Kaptan:</strong> Yanlış cevap. Doğru cevap: ${currentGameQuestion.answer}</p>`;
                window.speak(`Yanlış cevap. Doğru cevap ${currentGameQuestion.answer}`);
            }

            currentQuestionIndex++;
            if (currentQuestionIndex < 3) {
                setTimeout(askNextGameQuestion, 1500);
            } else {
                setTimeout(endGame, 1500);
            }
        }

        function endGame() {
            gameActive = false;
            gameOutput.innerHTML += `<p><strong>Palmiye Kaptan:</strong> Oyun bitti! Toplam **${gameScore} PalmCoin** kazandınız! TatilPuan'ınız güncellendi.</p>`;
            window.speak(`Oyun bitti! Toplam ${gameScore} PalmCoin kazandınız!`);
            gameAnswerInput.style.display = "none";
            submitGameAnswerBtn.style.display = "none";
            startGameBtn.style.display = "block";
            window.displayMembershipInfo();
        }

        virtualDurationMinutesInput.addEventListener("input", () => {
            const minutes = parseInt(virtualDurationMinutesInput.value) || 0;
            virtualTourCostEl.textContent = (minutes * VIRTUAL_TOUR_COST_PER_MINUTE);
        });

        startVirtualBtn.onclick = async () => {
            const city = virtualCityInput.value.trim();
            const days = parseInt(virtualDaysInput.value);
            const minutes = parseInt(virtualDurationMinutesInput.value);
            const activities = virtualActivitiesInput.value.trim();
            const imagePrompt = virtualImagePromptInput.value.trim();

            if (!city || isNaN(days) || days < 1 || isNaN(minutes) || minutes < 1 || !imagePrompt || !activities) {
                window.showModal("Eksik Bilgi", "Lütfen tüm sanal tatil alanlarını (Şehir, Gün Sayısı, Sanal Tur Süresi, Yapmak İstedikleriniz, Hediye Resim Açıklaması) eksiksiz doldurun.");
                return;
            }

            const totalCost = (minutes * VIRTUAL_TOUR_COST_PER_MINUTE);
            if (tatilPuan < totalCost) {
                window.showModal("Yetersiz PalmCoin", `Sanal tur için ${totalCost} PalmCoin'e ihtiyacınız var. Mevcut PalmCoin: ${tatilPuan}. Daha fazla PalmCoin kazanmak için oyun oynayabilir veya VIP üyeliğinizi kontrol edebilirsiniz.`);
                return;
            }

            virtualHolidayOutput.style.display = "none";
            virtualImagesContainer.innerHTML = '';
            sendVirtualImageEmailBtn.style.display = 'none';
            generatedVirtualImageUrl = '';

            await window.updateTatilPuan(-totalCost, `Sanal Tatil Oluşturma (${city}, ${days} gün)`);
            window.showModal("Ödeme Alındı", `${totalCost} PalmCoin bakiyenizden düşüldü. Sanal tatiliniz hazırlanıyor...`);

            const storyPrompt = `Please write a ${days}-day virtual holiday story for ${city}, lasting ${minutes} minutes.
                                The holiday should include activities like: ${activities}. Describe the places to visit, tastes to try, and experiences to live in detail.
                                The story should be engaging, immersive, and creative.
                                Create a separate paragraph for each day. At the end of each paragraph, add a short and descriptive image prompt for an image related to that day in the format "(GÖRSEL-PROMPT: [Image Description])".
                                Make sure to include at least ${days} image prompts.
                                General gift image prompt: "${imagePrompt}". You can use this as a theme throughout the story.
                                Provide the response in Turkish.`;

            const reply = await window.callOpenRouterAI(prompt, "openai/gpt-3.5-turbo", virtualLoading);
            virtualOutputTitle.textContent = `${city} - ${days} Günlük Sanal Tatil Hikayen:`;
            virtualOutputStory.innerHTML = '';
            const paragraphs = reply.split('\n').filter(p => p.trim() !== '');

            const imagePromptsForDays = [];
            let fullStoryHtml = '';
            let hasDailyImagePrompts = false;

            for (const p of paragraphs) {
                const dailyImageMatch = p.match(/\(GÖRSEL-PROMPT:\s*([^)]+)\)/);
                if (dailyImageMatch && dailyImageMatch[1]) {
                    imagePromptsForDays.push(dailyImageMatch[1].trim());
                    fullStoryHtml += `<p>${p.replace(dailyImageMatch[0], '').trim()}</p>`;
                    hasDailyImagePrompts = true;
                } else {
                    fullStoryHtml += `<p>${p}</p>`;
                }
            }
            virtualOutputStory.innerHTML = fullStoryHtml;
            virtualHolidayOutput.style.display = "block";

            generatedVirtualImageUrl = await window.callImageGenerationAI(imagePrompt, virtualLoading);
            if (generatedVirtualImageUrl) {
                const giftImageEl = document.createElement('img');
                giftImageEl.src = generatedVirtualImageUrl;
                giftImageEl.alt = imagePrompt;
                giftImageEl.style.cssText = 'max-width: 100%; height: auto; border-radius: 8px; margin-top: 15px; display: block; border: 2px solid #004d40;';
                const giftImageCaption = document.createElement('p');
                giftImageCaption.textContent = " 🎁  Sanal Tatil Hediye Görseliniz:";
                giftImageCaption.style.cssText = 'font-weight: bold; margin-top: 15px; color: #004d40; text-align: center;';
                virtualImagesContainer.appendChild(giftImageCaption);
                virtualImagesContainer.appendChild(giftImageEl);
                sendVirtualImageEmailBtn.style.display = 'block';
            }

            if (hasDailyImagePrompts) {
                window.showModal("Görseller Oluşturuluyor", `Sanal tatiliniz için ${imagePromptsForDays.length} adet özel görsel hazırlanıyor...`);
                for (let i = 0; i < imagePromptsForDays.length; i++) {
                    const dailyPrompt = imagePromptsForDays[i];
                    const dailyImageUrl = await window.callImageGenerationAI(dailyPrompt, virtualLoading);
                    if (dailyImageUrl) {
                        const dailyImageEl = document.createElement('img');
                        dailyImageEl.src = dailyImageUrl;
                        dailyImageEl.alt = `Gün ${i + 1} için görsel: ${dailyPrompt}`;
                        dailyImageEl.style.cssText = 'width: calc(50% - 15px); height: 180px; object-fit: cover; border-radius: 8px; border: 1px solid #00796b;';
                        const dailyImageCaption = document.createElement('p');
                        dailyImageCaption.textContent = `Gün ${i + 1} Görseli: ${dailyPrompt}`;
                        dailyImageCaption.style.cssText = 'font-size: 0.9em; color: #555; text-align: center; width: 100%;';
                        const imageWrapper = document.createElement('div');
                        imageWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: center; width: calc(50% - 15px); margin-bottom: 10px;';
                        imageWrapper.appendChild(dailyImageEl);
                        imageWrapper.appendChild(dailyImageCaption);
                        virtualImagesContainer.appendChild(imageWrapper);
                    }
                }
                window.speak("Sanal tatiliniz ve tüm görselleriniz hazır!");
            } else if (generatedVirtualImageUrl) {
                window.speak("Sanal tatiliniz ve hediye resminiz hazır!");
            } else {
                window.speak("Sanal tatiliniz hazır, ancak resimler oluşturulamadı.");
            }
            window.updateTatilPuan(10, "Sanal Tatil Başarılı");
        };

        sendVirtualImageEmailBtn.onclick = async () => {
            if (!generatedVirtualImageUrl) {
                window.showModal("Hata", "Önce bir sanal tatil resmi oluşturmalısınız.");
                return;
            }

            let emailToSendTo = userEmail;
            if (emailToSendTo === "Ayarlanmadı" || !emailToSendTo) {
                const newEmail = prompt("Hediye resmi göndermek için lütfen e-posta adresinizi girin:");
                if (newEmail && newEmail.trim() !== "") {
                    emailToSendTo = newEmail.trim();
                    if (currentUserId) {
                        await window.updateUserProfile({ email: emailToSendTo });
                    }
                    window.displayMembershipInfo();
                } else {
                    window.showModal("İptal Edildi", "E-posta adresi girilmediği için işlem iptal edildi.");
                    return;
                }
            }

            try {
                const sendWelcomeEmailCallable = functions.httpsCallable('sendWelcomeEmail'); // sendWelcomeEmail fonksiyonunu kullanıyoruz, ismini değiştirebiliriz.
                await sendWelcomeEmailCallable({ 
                    email: emailToSendTo, 
                    username: userName,
                    subject: "Sanal Tatil Hediye Görseliniz",
                    message: `Merhaba ${userName},<br><br>Sanal tatilinizden hediye görseliniz ektedir: <img src="${generatedVirtualImageUrl}" alt="Hediye Görsel">`,
                    imageUrl: generatedVirtualImageUrl // Görsel URL'sini de fonksiyona gönderebiliriz
                });
                window.showModal("E-posta Gönderildi (Simülasyon)", `Hediye resminiz ${emailToSendTo} adresine gönderildi (simülasyon).`);
                window.speak("Mesajınız başarıyla gönderildi.");

                contactSubjectInput.value = '';
                contactEmailInput.value = userEmail !== "Ayarlanmadı" ? userEmail : '';
                contactMessageInput.value = '';
                contactFileInput.value = '';
            } catch (error) {
                console.error("Hediye görseli e-posta gönderirken hata:", error);
                window.showModal("Hata", `Hediye resmi e-posta ile gönderilirken bir sorun oluştu: ${error.message}.`);
            }
        };

        goToAiPhotoPaymentBtn.onclick = () => window.showSection("payment-section");

        generateAiPhotoButton.onclick = async () => {
            const promptText = aiPhotoPromptInput.value.trim();
            const style = aiPhotoStyleSelect.value;
            const count = parseInt(aiPhotoCountInput.value);

            if (!promptText) {
                window.showModal("Eksik Bilgi", "Lütfen oluşturmak istediğiniz fotoğrafı tanımlayın.");
                return;
            }
            if (isNaN(count) || count < 1 || count > 3) {
                window.showModal("Hata", "Lütfen 1 ile 3 arasında geçerli bir resim sayısı girin.");
                return;
            }
            if (userMembershipLevel !== "Altın") {
                window.showModal("Erişim Reddedildi", "Bu özellik sadece Altın üyelere özeldir. Lütfen üyeliğinizi yükseltin.");
                return;
            }

            generatedImagesContainer.innerHTML = '';
            downloadAllImagesBtn.style.display = 'none';
            aiPhotoOutput.style.display = 'none';
            currentGeneratedImages = [];

            const totalDownloadCost = count * IMAGE_DOWNLOAD_COST_PER_IMAGE;
            downloadAllCostSpan.textContent = totalDownloadCost;

            aiPhotoOutput.style.display = 'block';
            window.showModal("Görsel Oluşturuluyor", `Yapay zeka fotoğrafınız (${count} adet) oluşturuluyor...`);

            for (let i = 0; i < count; i++) {
                const combinedPrompt = `${promptText}, style: ${style}`;
                const imageUrl = await window.callImageGenerationAI(combinedPrompt, aiPhotoLoading);
                if (imageUrl) {
                    currentGeneratedImages.push(imageUrl);
                    const imgElement = document.createElement('img');
                    imgElement.src = imageUrl;
                    imgElement.alt = `Gün ${i + 1} için görsel: ${promptText}`;
                    imgElement.style.cssText = 'width: calc(50% - 15px); height: 180px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);';
                    generatedImagesContainer.appendChild(imgElement);
                }
            }

            if (currentGeneratedImages.length > 0) {
                downloadAllImagesBtn.style.display = 'block';
                window.speak("Fotoğraflarınız başarıyla oluşturuldu!");
            } else {
                window.showModal("Hata", "Hiç fotoğraf oluşturulamadı. Lütfen prompt'u kontrol edin.");
                window.speak("Hiç fotoğraf oluşturulamadı.");
            }
        };

        downloadAllImagesBtn.onclick = async () => {
            if (currentGeneratedImages.length === 0) {
                window.showModal("Hata", "Önce bir sanal tatil resmi oluşturmalısınız.");
                return;
            }

            const totalCost = currentGeneratedImages.length * IMAGE_DOWNLOAD_COST_PER_IMAGE;
            if (tatilPuan < totalCost) {
                window.showModal("Yetersiz PalmCoin", `Tüm fotoğrafları indirmek için ${totalCost} PalmCoin'e ihtiyacınız var. Mevcut PalmCoin: ${tatilPuan}.`);
                return;
            }

            await window.updateTatilPuan(-totalCost, `AI Fotoğraf İndirme (${currentGeneratedImages.length} adet)`);
            window.showModal("İndiriliyor!", `Tüm ${currentGeneratedImages.length} fotoğrafınız indiriliyor. PalmCoin bakiyeniz güncellendi.`);
            window.speak("Fotoğraflarınız indiriliyor.");

            for (let i = 0; i < currentGeneratedImages.length; i++) {
                const imageUrl = currentGeneratedImages[i];
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `palmiye-kaptan-ai-foto-${Date.now()}-${i + 1}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            currentGeneratedImages = [];
            aiPhotoOutput.style.display = 'none';
        };

        goToVipPaymentBtn.onclick = () => window.showSection("payment-section");

        vipBudgetButtons.forEach(button => {
            button.onclick = () => {
                vipBudgetButtons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
                selectedBudget = button.dataset.budget;
            };
        });

        generateVipPlanBtn.onclick = async () => {
            const destination = vipDestinationInput.value.trim();
            const duration = parseInt(vipDurationInput.value);
            const travelers = parseInt(vipTravelersInput.value);
            const travelType = vipTypeSelect.value;

            if (!destination || isNaN(duration) || duration < 1 || isNaN(travelers) || travelers < 1 || !selectedBudget) {
                window.showModal("Eksik Bilgi", "Lütfen tüm alanları doldurun ve bütçe seçimi yapın.");
                return;
            }
            if (userMembershipLevel !== "Altın") {
                window.showModal("Erişim Reddedildi", "Bu özellik sadece Altın üyelere özeldir. Lütfen üyeliğinizi yükseltin.");
                return;
            }

            vipPlanOutput.style.display = "none";
            vipPlanChatArea.style.display = "none";
            vipPlanChatBox.innerHTML = '';
            currentVipPlan = "";

            const selectedLanguage = languageSelect.value;
            const languagePrompt = `in ${selectedLanguage === 'tr' ? 'Turkish' : 'English'}`;

            const prompt = `Please create a very detailed, comprehensive, and personalized A-to-Z holiday plan for ${destination} for ${duration} days, for ${travelers} people, with a ${selectedBudget} budget, and a ${travelType} theme.
                                Respond ${languagePrompt}.
                                Include flight suggestions (example airline and approximate price range), hotel suggestions (example hotel name, price range, proximity to location, and features), airport transfer suggestions (how to do it, approximate cost), daily detailed places to visit/activities/food suggestions (specific places and tastes for morning, noon, and evening).
                                All suggestions should be suitable for this budget. Provide example links (like Booking.com, Skyscanner, TripAdvisor, a random Unsplash image link).
                                Enrich the details, include small details, not just main outlines.`;

            const reply = await window.callOpenRouterAI(prompt, "openai/gpt-3.5-turbo", vipPlannerLoading);
            currentVipPlan = reply;
            let planContent = reply;

            const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpe?g|gif|webp|unsplash\.com\/\S+|pixabay\.com\/\S+))/i;
            const match = planContent.match(urlRegex);
            let mediaHtml = "";
            if (match) {
                mediaHtml = `<br><img src="${match[0]}" alt="${destination} Planı">`;
                planContent = planContent.replace(match[0], '').trim();
            } else {
                const genericImageUrl = `https://placehold.co/800x600?text=${encodeURIComponent(destination)} VIP Travel`;
                mediaHtml = `<br><img src="${genericImageUrl}" alt="${destination} Planı">`;
            }

            vipPlanOutput.innerHTML = `<h4>${destination} için ${duration} Günlük VIP Tatil Planınız:</h4><p>${planContent.replace(/\n/g, '<br>')}</p>${mediaHtml}`;
            vipPlanOutput.style.display = "block";
            vipPlanChatArea.style.display = "block";
            window.speak(`${destination} için VIP tatil planınız hazır.`);
            await window.updateTatilPuan(100, `VIP Plan Oluşturma (${destination})`);
        };

        sendVipPlanMessageBtn.onclick = async () => {
            const userQuestion = vipPlanInput.value.trim();
            if (!userQuestion) return;

            if (tatilPuan < VIP_PLAN_CHAT_COST) {
                window.showModal("Yetersiz PalmCoin", `Bu soru için ${VIP_PLAN_CHAT_COST} PalmCoin'e ihtiyacınız var. Mevcut PalmCoin: ${tatilPuan}.`);
                return;
            }

            window.displayMessage("user", userQuestion, vipPlanChatBox);
            companionChatHistory.push({ role: "user", content: userQuestion });
            vipPlanInput.value = "";

            if (!aiCompanion) {
                window.showModal("Hata", "Önce bir AI Yoldaşı oluşturmalısın!");
                return;
            }

            const maxHistoryLength = 5;
            const recentHistory = companionChatHistory.slice(Math.max(0, companionChatHistory.length - maxHistoryLength));

            const selectedLanguage = languageSelect.value;
            const languagePrompt = `in ${selectedLanguage === 'tr' ? 'Turkish' : 'English'}`;

            const systemMessage = {
                role: "system",
                content: `Your name is ${aiCompanion.name} and your personality is ${aiCompanion.personality}. The user's name is ${userName}.
                            Respond ${languagePrompt}.
                            Help the user with travel and holiday topics. Provide creative, friendly, and conversational responses in line with your personality.
                            Maintain context by considering the user's previous messages.`
            };
            const messagesToSend = [systemMessage, ...recentHistory];

            const reply = await window.callOpenRouterAI(null, "openai/gpt-3.5-turbo", companionLoading, messagesToSend);

            window.displayMessage("ai", reply, companionChatBox);
            companionChatHistory.push({ role: "assistant", content: reply });
            companionChatBox.scrollTop = companionChatBox.scrollHeight;
            window.speak(reply);
        };

        companionInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendCompanionMessageBtn.click();
        });

        completePaymentBtn.onclick = async () => {
            const cardNumber = cardNumberInput.value.trim();
            const expiryDate = expiryDateInput.value.trim();
            const cvv = cvvInput.value.trim();
            const cardHolderName = cardHolderNameInput.value.trim();

            if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
                window.showModal("Hata", "Lütfen tüm kart bilgilerini doldurun.");
                return;
            }

            if (cardNumber.replace(/\s/g, '').length !== 16 || !/^\d{2}\/\d{2}$/.test(expiryDate) || !/^\d{3,4}$/.test(cvv)) {
                window.showModal("Hata", "Lütfen geçerli kart bilgileri girin. (Demo için format önemi)");
                return;
            }

            window.showModal("Ödeme İşleniyor...", "Ödemeniz simüle ediliyor. Lütfen bekleyin...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            userMembershipLevel = "Altın";
            if (currentUserId) {
                await window.updateUserProfile({ membershipLevel: userMembershipLevel });
            }
            await window.updateTatilPuan(200, "Altın Üyelik Satın Alma");

            let discountMessage = "Tebrikler! Artık Altın Üyesiniz! Tüm VIP özelliklere erişiminiz var. Keyfini çıkarın!";
            if (tatilPuan > 150) {
                const bonusPalmCoin = 100;
                gameScore += bonusPalmCoin;
                if (currentUserId) {
                    await window.updateUserProfile({ gameScore: gameScore });
                }
                await window.updateTatilPuan(bonusPalmCoin, "Altın Üyelik Bonusu");
                discountMessage += `<br><br>Sadakatiniz için teşekkür ederiz! Yüksek TatilPuan'ınız sayesinde **${bonusPalmCoin} PalmCoin** hediye kazandınız!`;
            }

            window.showModal("Ödeme Başarılı!", discountMessage);
            window.speak("Ödemeniz başarılı. Artık Altın üyesiniz!");
            window.showSection("user-info-section");
        };

        sendContactFormBtn.onclick = async () => {
            const subject = contactSubjectInput.value.trim();
            const email = contactEmailInput.value.trim();
            const message = contactMessageInput.value.trim();
            const file = contactFileInput.files[0];

            if (!subject || !email || !message) {
                window.showModal("Eksik Bilgi", "Lütfen Konu, E-posta Adresi ve Mesaj alanlarını doldurun.");
                return;
            }

            if (contactLoading) contactLoading.style.display = 'block';

            let fileData = null;
            let fileName = null;
            let fileType = null;

            if (file) {
                fileName = file.name;
                fileType = file.type;
                const reader = new FileReader();
                reader.readAsDataURL(file); // Base64 olarak oku

                await new Promise((resolve, reject) => {
                    reader.onload = () => {
                        fileData = reader.result.split(',')[1]; // Sadece Base64 verisini al
                        resolve();
                    };
                    reader.onerror = error => reject(error);
                });
            }

            try {
                const submitContactFormCallable = functions.httpsCallable('submitContactForm');
                const result = await submitContactFormCallable({ 
                    subject, 
                    email, 
                    message, 
                    fileName, 
                    fileType, 
                    fileData 
                });

                console.log("İletişim Formu Cloud Function yanıtı:", result.data.message);
                window.showModal("Mesajınız Gönderildi", result.data.message + (result.data.fileUrl ? `<br>Ekli dosya URL: ${result.data.fileUrl}` : ''));
                window.speak("Mesajınız başarıyla gönderildi.");

                contactSubjectInput.value = '';
                contactEmailInput.value = userEmail !== "Ayarlanmadı" ? userEmail : '';
                contactMessageInput.value = '';
                contactFileInput.value = '';
            } catch (error) {
                console.error("İletişim formu gönderilirken hata:", error);
                window.showModal("Hata", `Mesajınız gönderilirken bir sorun oluştu: ${error.message}.`);
            } finally {
                if (contactLoading) contactLoading.style.display = 'none';
            }
        };

        // Yıl bilgisini güncelleyen kısım
        const currentYearElement = document.getElementById('currentYear');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }

        // F12 uyarıları kaldırıldı
        // console.warn("UYARI: Bu demo tek dosya, prototipleme amaçlıdır ve üretim için uygun DEĞİLDİR. API anahtarları artık frontend'de olmasa da, hassas işlemler (örn. ödeme işlemleri) için güçlü bir backend doğrulama ve güvenlik yapısı şarttır.");
        // console.warn("Firebase yapılandırma bilgilerinizi kendi bilgilerinizle değiştirmeyi UNUTMAYIN.");
        // console.warn("Firebase güvenlik kurallarınızı (Firestore Security Rules) uygulamanızın gereksinimlerine göre ayarladığınızdan emin olun. Özellikle 'public' koleksiyonları için okuma/yazma izinlerini ve kullanıcı profilleri için kullanıcıların yalnızca kendi verilerini okuyabil...
        ```