// document.querySelectorAll('button').forEach(button => {
    //     button.addEventListener('click', function() {
    //         alert(`${this.textContent} butonuna basıldı!`);
    //         console.log('Button clicked:', this.id || this.textContent);
    //     });
    // });
// NOT: Firebae SDK'ları HTML dosyasında <head> veya <body> etiketleri içinde yüklenmelidir.

// Sabitler
const IMAGE_DOWNLOAD_COST_PER_IMAGE = 50;
const VIRTUAL_TOUR_COST_PER_MINUTE = 10;
const VIP_PLAN_CHAT_COST = 10;




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
const sloganTop = document.getElementById("slogan-top"); // Element DOM'da kalacak, ama JS'ten güncellenmeyecek
const voiceToggleTop = document.getElementById("voice-toggle-top");
const languageSelect = document.getElementById("language-select");
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
const registerEmailInput = document.getElementById('registerEmail');
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
// ... existing code ...

document.addEventListener('DOMContentLoaded', function() {
    const downloadAllImagesBtn = document.getElementById('download-all-images-btn');
    if(downloadAllImagesBtn) {
        downloadAllImagesBtn.onclick = function() {
            // ... existing onclick code ...
        };
    } else {
        console.error('download-all-images-btn element not found');
    }
});

// ... existing code ...const generatedImagesContainer = document.getElementById("generated-images-container");
// const downloadAllImagesBtn = document.getElementById("download-all-images-btn");
const downloadAllCostSpan = document.getElementById("download-all-cost");

// VIP Planlayıcı
const vipAccessCheck = document.getElementById("vip-access-check");
const goToVipPaymentBtn = document.getElementById("go-to-vip-payment-btn");
const vipPlannerFormArea = document.getElementById("vip-planner-form-area");
const vipDestinationInput = document.getElementById("vip-destination");
const vipDurationInput = document.getElementById("vip-duration");
const vipTravelersInput = document.getElementById("vip-travelers");
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
const displayUsername = document.getElementById("display-username");
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
const timeTravelFocusInput = document.getElementById("time-travel-focus");
const startTimeTravelBtn = document.getElementById("start-time-travel-btn");
const timeTravelLoading = document.getElementById("time-travel-loading");
const timeTravelOutput = document.getElementById("time-travel-output");

// Kader Rotası
const destinyAgeInput = document.getElementById("destiny-age");
const destinyHobbyInput = document.getElementById("destiny-hobby");
const destinyDreamInput = document.getElementById("destiny-dream");
const destinyColorInput = document.getElementById("destiny-color");
const predictDestinyBtn = document.getElementById("predict-destiny-btn");
const destinyLoading = document.getElementById("destiny-loading");
const destinyRouteOutput = document.getElementById("destiny-route-output");
const realizeDestinyBtn = document.getElementById("realize-destiny-btn");

// AI Yoldaşım
const companionNameInput = document.getElementById("companion-name");
const companionPersonalitySelect = document.getElementById("companion-personality");
const createCompanionBtn = document.getElementById("create-companion-btn");
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
const contactMessageInput = document.getElementById('contact-message');
const contactFileInput = document.getElementById('contact-file');
const sendContactFormBtn = document.getElementById('send-contact-form-btn');
const contactLoading = document.getElementById('contact-loading');


// --- Uygulama Başlangıcı ve Genel Fonksiyonlar ---
window.initializeAppFeatures = function() {
    // Slogan güncellemesi kaldırıldığı için ilgili kodlar çıkarıldı.
    // Artık bu fonksiyon boş, ama DOMContentLoaded'dan çağrılabilir.
};

/**
 * Belirtilen modal elementini gizler.
 * @param {HTMLElement} modalElement - Gizlenecek modal element.
 */
function hideModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = "none";
    }
}
window.hideModal = hideModal;

/**
 * Firebase kimlik doğrulama durumu değiştiğinde çalışacak listener.
 * Kullanıcının oturum açmasını veya anonim olarak devam etmesini sağlar.
 */
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
        loadAds(); // Reklamları yükle (şu an statik HTML reklamları gösteriyor)
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
        if (userIdDisplay) userIdDisplay.textContent = `UID: Misafir`;
        if (mainLayout) {
            mainLayout.style.display = 'flex'; // Giriş yapılmasa bile ana düzeni göster (ücretsiz özellikler için)
        }
        // Açık tüm modalları kapat
        hideModal(loginModal);
        hideModal(registerModal);
        hideModal(forgotPasswordModal);
    }
});

// --- Firebase Kullanıcı Verileri Fonksiyonları ---
/**
 * Mevcut kullanıcının Firestore profil referansını döndürür.
 * @returns {firebase.firestore.DocumentReference|null} Kullanıcı profil belgesine referans veya null.
 */
window.getUserProfileRef = function() {
    if (!firestore || !currentUserId) {
        console.warn("Firestore veya Kullanıcı ID'si hazır değil. Profil referansı alınamıyor.");
        return null;
    }
    return firestore.collection('users').doc(currentUserId);
};

/**
 * Kullanıcı profilini Firestore'dan yükler ve gerçek zamanlı güncellemeler için dinler.
 */
window.loadUserProfile = async function() {
    const profileRef = window.getUserProfileRef();
    if (!profileRef) {
        console.log("Profil referansı mevcut değil, varsayılan bilgiler gösteriliyor.");
        window.displayMembershipInfo();
        window.updateTatilPuanDisplay();
        if (userIdDisplay) userIdDisplay.textContent = `UID: ${currentUserId || 'Misafir'}`;
        return;
    }

    // Real-time güncellemeler için onSnapshot kullan
    profileRef.onSnapshot((docSnap) => {
        if (docSnap.exists) {
            const data = docSnap.data();
            userName = data.username || auth.currentUser.displayName || "Misafir";
            tatilPuan = data.tatilPuanlari || 0;
            userMembershipLevel = data.membershipLevel || "Bronz";
            gameScore = data.gameScore || 0;
            userEmail = data.email || auth.currentUser.email || "Ayarlanmadı";
            palmCoinHistory = data.palmCoinHistory || [{ timestamp: new Date().toISOString(), type: "Başlangıç", amount: 0, current: 0 }];
            console.log("Kullanıcı profili Firestore'dan yüklendi:", data);
        } else {
            console.log("Kullanıcı profili bulunamadı, varsayılan oluşturuluyor.");
            // Profil yoksa varsayılan profil oluştur. Bu ideal olarak kullanıcı kaydında gerçekleşmeli.
            window.updateUserProfile({
                username: auth.currentUser.displayName || auth.currentUser.email,
                email: auth.currentUser.email,
                tatilPuanlari: 0,
                membershipLevel: "Bronz",
                gameScore: 0,
                palmCoinHistory: [{ timestamp: new Date().toISOString(), type: "Başlangıç", amount: 0, current: 0 }]
            });
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

/**
 * Kullanıcı profilini Firestore'da günceller.
 * @param {object} dataToUpdate - Güncellenecek veri objesi.
 */
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
        console.error("Kullanıcı profili güncellenirken hata:", error);
        window.showModal("Hata", `Kullanıcı verileri kaydedilirken bir sorun oluştu: ${error.message}.`);
    }
};

// --- Firebase İlan ve Yönetici Mesajı Yönetimi Fonksiyonları ---
/**
 * Reklam koleksiyonuna referans döndürür.
 * @returns {firebase.firestore.CollectionReference|null} Reklam koleksiyonuna referans veya null.
 */
window.getAdsCollectionRef = function() {
    if (!firestore) {
        console.error("Firestore hazır değil.");
        return null;
    }
    // Ortak erişilebilir bir koleksiyon için yol
    return firestore.collection('public').doc('data').collection('ads');
};

/**
 * Yönetici mesajı belgesine referans döndürür.
 * @returns {firebase.firestore.DocumentReference|null} Yönetici mesajı belgesine referans veya null.
 */
window.getAdminMessageRef = function() {
    if (!firestore) {
        console.error("Firestore hazır değil.");
        return null;
    }
    // Ortak erişilebilir bir belge için yol
    return firestore.collection('public').doc('data').collection('admin').doc("message");
};

/**
 * Dinamik reklamları Firestore'dan yükler.
 */
window.loadAds = async function() {
    // Dinamik reklamları Firestore'dan yükleme kodunuz buraya gelebilir.
    // Mevcut HTML statik reklamları kullandığı için, bu fonksiyon çoğunlukla bir yer tutucudur.
    const adsCollectionRef = window.getAdsCollectionRef();
    if (!adsCollectionRef) {
        console.log("Reklam koleksiyonu referansı mevcut değil.");
        return;
    }
    // Firestore'dan dinamik reklamları çekme örneği (eğer isterseniz bu yorum satırlarını kaldırıp kullanabilirsiniz)
    /*
    try {
        const snapshot = await adsCollectionRef.get();
        const ads = snapshot.docs.map(doc => doc.data());
        const dynamicAdsContainer = document.getElementById('dynamic-ads-container');
        if (dynamicAdsContainer) {
            // Mevcut statik reklamları değiştirmek isterseniz:
            dynamicAdsContainer.innerHTML = '';
            ads.forEach(ad => {
                const adElement = document.createElement('a');
                adElement.href = ad.url;
                adElement.target = '_blank';
                adElement.classList.add('ad-area-dynamic');
                adElement.innerHTML = `<img src="${ad.imageUrl}" alt="${ad.title}"><p>${ad.text}</p>`;
                dynamicAdsContainer.appendChild(adElement);
            });
        }
    } catch (error) {
        console.error("Dinamik reklamlar yüklenirken hata:", error);
    }
    */
};

/**
 * Yönetici mesajını Firestore'dan yükler ve gerçek zamanlı güncellemeler için dinler.
 */
window.loadAdminMessage = async function() {
    const adminMessageRef = window.getAdminMessageRef();
    if (!adminMessageRef) {
        console.log("Yönetici mesajı referansı mevcut değil.");
        if (adminDisplayMessageEl && adminDisplayMessageEl.querySelector('p')) {
            adminDisplayMessageEl.querySelector('p').textContent = "Yönetici mesajı yüklenemedi: Veri hazır değil.";
        }
        return;
    }

    adminMessageRef.onSnapshot((docSnap) => {
        if (adminDisplayMessageEl) {
            const adminDisplayMessageP = adminDisplayMessageEl.querySelector('p');
            if (adminDisplayMessageP) {
                if (docSnap.exists && docSnap.data().message) {
                    adminDisplayMessageP.textContent = docSnap.data().message;
                } else {
                    adminDisplayMessageP.textContent = "Yönetici mesajı bulunmamaktadır.";
                }
            }
        }
    }, (error) => {
        console.error("Yönetici mesajı yüklenirken hata:", error);
        if (adminDisplayMessageEl && adminDisplayMessageEl.querySelector('p')) {
            let errorMessage = `Yönetici mesajı yüklenemedi: ${error.message}.`;
            if (error.code === 'permission-denied') {
                errorMessage += " Lütfen Firebase güvenlik kurallarınızı kontrol edin (public/data/admin okuma izni).";
            }
            adminDisplayMessageEl.querySelector('p').textContent = errorMessage;
        }
    });
};

/**
 * Yönetici mesajını bir Cloud Function aracılığıyla günceller.
 * @param {string} message - Güncellenecek mesaj metni.
 */
window.updateAdminMessage = async function(message) {
    const updateAdminMessageCallable = firebase.functions().httpsCallable('updateAdminMessage');
    const adminMessageLoadingEl = document.getElementById("admin-message-loading");

    if (adminMessageLoadingEl) adminMessageLoadingEl.style.display = 'block';
    try {
        const result = await updateAdminMessageCallable({ message: message });
        console.log("Yönetici mesajı başarıyla güncellendi (Cloud Function):", result.data);
        window.showModal("Başarılı", result.data.message);
    }
    catch (error) {
        console.error("Yönetici mesajı güncellenirken Cloud Function hatası:", error);
        let errorMessage = `Yönetici mesajı güncellenirken bir sorun oluştu: ${error.message}.`;
        if (error.code === 'permission-denied') {
            errorMessage += " Yetkiniz olmayabilir veya güvenlik kuralları engelliyor olabilir.";
        } else if (error.code === 'unauthenticated') {
            errorMessage += " Bu işlemi gerçekleştirmek için giriş yapmalısınız.";
        }
        window.showModal("Hata", errorMessage);
    } finally {
        if (adminMessageLoadingEl) adminMessageLoadingEl.style.display = "none";
    }
};

// --- Genel UI ve Yardımcı Fonksiyonlar ---
/**
 * Özelleştirilmiş bir modal pencere gösterir.
 * @param {string} title - Modal başlığı.
 * @param {string} message - Modal içeriği.
 * @returns {Promise<boolean>} Kullanıcının "Tamam" düğmesine tıklamasını bekleyen bir Promise.
 */
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

    // Önceki olay dinleyiciyi kaldır
    const oldConfirmListener = modalConfirmBtnEl._eventListener;
    if (oldConfirmListener) {
        modalConfirmBtnEl.removeEventListener("click", oldConfirmListener);
    }

    return new Promise((resolve) => {
        const handleConfirm = () => {
            modal.style.display = "none";
            modalConfirmBtnEl.removeEventListener("click", handleConfirm);
            modalConfirmBtnEl._eventListener = null; // Bellek sızıntısını önle
            resolve(true);
        };
        modalConfirmBtnEl.addEventListener("click", handleConfirm); // Düzeltme: modalConfirmBtnBtn yerine modalConfirmBtnEl
        modalConfirmBtnEl._eventListener = handleConfirm; // Dinleyiciyi sakla
    });
};

/**
 * Sohbet kutusuna yeni bir mesaj ekler.
 * @param {string} sender - Mesajı gönderen (örn: "user", "ai").
 * @param {string} text - Mesaj metni.
 * @param {HTMLElement} chatBoxElement - Mesajın ekleneceği sohbet kutusu elementi.
 */
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
};

/**
 * Metni sesli olarak okur.
 * @param {string} text - Okunacak metin.
 */
window.speak = function(text) {
    const languageSelectEl = document.getElementById("language-select");
    if (!languageSelectEl || !voiceEnabled || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageSelectEl.value + "-" + languageSelectEl.value.toUpperCase(); // örn: "tr-TR", "en-US"
    speechSynthesis.speak(utterance);
};

/**
 * Kullanıcının TatilPuanını günceller ve geçmişe kaydeder.
 * Üyelik seviyesini de kontrol eder ve gerekirse günceller.
 * @param {number} points - Eklenecek veya çıkarılacak puan miktarı.
 * @param {string} activity - Puanın kazanıldığı/harcandığı aktivite açıklaması.
 */
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
        palmCoinHistory = palmCoinHistory.slice(palmCoinHistory.length - 20); // Son 20 girişi tut
    }

    const oldLevel = userMembershipLevel;
    if (tatilPuan < 100) {
        userMembershipLevel = "Bronz";
    } else if (tatilPuan < 200) {
        userMembershipLevel = "Gümüş";
    } else {
        userMembershipLevel = "Altın";
    }

    if (currentUserId) { // Sadece giriş yapmış kullanıcılar için güncelle
        await window.updateUserProfile({
            tatilPuanlari: tatilPuan,
            membershipLevel: userMembershipLevel,
            palmCoinHistory: palmCoinHistory,
            gameScore: gameScore // gameScore'u da güncel tut
        });
    }

    if (oldLevel !== userMembershipLevel) {
        window.showModal("Tebrikler!", `Üyelik seviyeniz **${userMembershipLevel}** seviyesine yükseldi! Yeni özelliklere göz atın.`);
        window.speak(`Tebrikler! Üyelik seviyeniz ${userMembershipLevel} seviyesine yükseldi!`);
    }
    window.updatePalmCoinHistoryDisplay();
    window.updateTatilPuanDisplay(); // UI'nin güncel olduğundan emin ol
};

/**
 * TatilPuan ve üyelik seviyesi gösterimini günceller.
 */
window.updateTatilPuanDisplay = function() {
    if (tatilpuanTop) {
        tatilpuanTop.innerHTML = `<i class="fas fa-star"></i> TatilPuan: ${tatilPuan} (${userMembershipLevel})`;
    }
    if (displayTatilpuan) displayTatilpuan.textContent = tatilPuan;
    if (displayMembershipLevel) displayMembershipLevel.textContent = userMembershipLevel;
};

/**
 * Kullanıcı üyelik bilgilerini (ID, kullanıcı adı, e-posta, puan vb.) gösterir.
 */
window.displayMembershipInfo = function() {
    if (displayUserId) displayUserId.textContent = currentUserId || "Yükleniyor...";
    if (displayUsername) displayUsername.textContent = userName;
    if (displayUserEmail) displayUserEmail.textContent = userEmail;
    if (displayTatilpuan) displayTatilpuan.textContent = tatilPuan;
    if (displayMembershipLevel) displayMembershipLevel.textContent = userMembershipLevel;
    if (displayGameScore) displayGameScore.textContent = gameScore;
    if (userIdDisplay) userIdDisplay.textContent = `UID: ${currentUserId || 'Misafir'}`;
};

/**
 * PalmCoin geçmişi listesini günceller.
 */
window.updatePalmCoinHistoryDisplay = function() {
    if (!palmCoinHistoryList) return;
    palmCoinHistoryList.innerHTML = '';
    // Ters kronolojik sırayla göster
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

/**
 * Uygulama bölümlerini gösterir/gizler ve aktif butonu işaretler.
 * @param {string} sectionId - Gösterilecek bölümün ID'si.
 */
window.showSection = function(sectionId) {
    contentSections.forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add("active");
        activeSection.style.display = "flex"; // 'block' yerine 'flex' düzenli bir yerleşim için
    }

    sidebarButtons.forEach(button => button.classList.remove("active"));
    const activeButton = document.querySelector(`.sidebar-nav button[data-section='${sectionId}']`);
    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Özel bölüm kontrolleri
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
        window.loadAdminMessage(); // Yönetici mesajını kullanıcı bilgileri bölümünde yeniden yükle
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
    // "Bize Ulaşın" bölümü için temizlik (varsa)
    if (sectionId === "contact-us-section") {
        if (contactSubjectInput) contactSubjectInput.value = '';
        if (contactEmailInput) contactEmailInput.value = userEmail !== "Ayarlanmadı" ? userEmail : '';
        if (contactMessageInput) contactMessageInput.value = '';
        if (contactFileInput) contactFileInput.value = ''; // Dosya inputunu temizle
    }
};

/**
 * Bir özelliğe erişim için kullanıcının üyelik seviyesini kontrol eder.
 * @param {HTMLElement} accessCheckEl - Erişim kontrol mesajını gösteren element.
 * @param {HTMLElement} formAreaEl - Özelliğin form alanını gösteren element.
 * @param {string} requiredLevel - Gerekli üyelik seviyesi (örn: "Altın").
 */
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

/**
 * OpenRouter AI API'sini bir Cloud Function aracılığıyla çağırır.
 * @param {string} prompt - AI'ye gönderilecek metin istemi.
 * @param {string} model - Kullanılacak AI modeli.
 * @param {HTMLElement} loadingIndicator - Yükleme göstergesi elementi.
 * @param {Array<object>} currentChatHistory - Mevcut sohbet geçmişi.
 * @returns {Promise<string>} AI'den gelen yanıt.
 */
window.callOpenRouterAI = async function(prompt, model = "openai/gpt-3.5-turbo", loadingIndicator = null, currentChatHistory = []) {
    if (loadingIndicator) loadingIndicator.style.display = "block";

    try {
        const callAI = firebase.functions().httpsCallable('callOpenRouterAI');
        const result = await callAI({ prompt: prompt, model: model, chatHistory: currentChatHistory });
        return result.data.reply;
    } catch (error) {
        console.error("OpenRouter AI Cevap Hatası (Cloud Function):", error);
        window.showModal("AI Hatası!", `Bir AI hatası oluştu: ${error.message}. Lütfen API anahtarınızı, internet bağlantınızı veya Cloud Functions ayarlarınızı kontrol edin.`);
        return `Bir hata oluştu: ${error.message}`;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = "none";
    }
};

/**
 * Google Gemini API'sini bir Cloud Function aracılığıyla görsel oluşturmak için çağırır.
 * @param {string} promptText - Görsel oluşturma istemi.
 * @param {HTMLElement} loadingIndicator - Yükleme göstergesi elementi.
 * @returns {Promise<string|null>} Oluşturulan görselin URL'si veya null.
 */
window.callImageGenerationAI = async function(promptText, loadingIndicator = null) {
    if (loadingIndicator) loadingIndicator.style.display = "block";

    try {
        const callImageAI = firebase.functions().httpsCallable('callImageGenerationAI');
        const result = await callImageAI({ promptText: promptText });
        return result.data.imageUrl; // Cloud Function'dan gelen imageUrl'yi döndür
    } catch (error) {
        console.error("Gemini Görsel Oluşturma AI Hatası (Cloud Function):", error);
        window.showModal("Görsel Oluşturma Hatası!", `Görsel oluşturulurken bir sorun oluştu: ${error.message}.`);
        return null;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = "none";
    }
};


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    const sendCompanionMessageBtn = document.getElementById("send-companion-message-btn");
    const companionInput = document.getElementById("companion-input");
    const companionChatBox = document.getElementById("companion-chat-box");
    const companionChatArea = document.getElementById("companion-chat-area");
    const activeCompanionName = document.getElementById("active-companion-name");

    window.initializeAppFeatures();

    sidebarButtons.forEach(button => {
        button.addEventListener("click", () => {
            const sectionId = button.dataset.section;
            window.showSection(sectionId);
        });
    });

    // Ana sohbet asistanı// ... existing code ...

// Sabitler
const IMAGE_DOWNLOAD_COST_PER_IMAGE = 50;
const VIRTUAL_TOUR_COST_PER_MINUTE = 10;
const VIP_PLAN_CHAT_COST = 10;


// const auth = firebase.auth(); // Bu satırı yorum satırı yapın veya silin
// const firestore = firebase.firestore(); // Bu satırı yorum satırı yapın veya silin
// const functions = firebase.functions(); // Bu satırı yorum satırı yapın veya silin
// const storage = firebase.storage(); // Bu satırı yorum satırı yapın veya silin
// const virtualOutputStory = document.getElementById("virtual-output-story"); // Bu satırı yorum satırı yapın veya silin

// Global Değişkenler



    // TÜM BUTONLARA GENEL İŞLEVSELLİK EKLEME KISMI KALDIRILDI
    // Bu kısım, her butona gereksiz bir alert ekliyordu ve diğer olay dinleyicileriyle çakışıyordu.
    // document.querySelectorAll('button').forEach(button => {
    //     button.addEventListener('click', function() {
    //         alert(`${this.textContent} butonuna basıldı!`);
    //         console.log('Button clicked:', this.id || this.textContent);
    //     });
    // });
    sendChatBtn.onclick = async () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        window.displayMessage("user", userMessage, chatBox);
        chatHistory.push({ role: "user", content: userMessage }); // Kullanıcı mesajını geçmişe ekle
        chatInput.value = "";

        const selectedLanguage = languageSelect.value;
        const languagePrompt = selectedLanguage === 'tr' ? '(Türkçe)' : '(English)';

        const promptForAI = `You are a helpful travel assistant called "Palmiye Kaptan". User's message: "${userMessage}".
                            Detect the language of the message (${languagePrompt}) and respond in that language.
                            Provide creative, informative, and personalized assistance on topics like travel, destinations, accommodation, activities, budget planning, virtual tours, historical sites, and cultural experiences.
                            Avoid repetitive or generic answers. Understand the context by considering previous messages in the chat history.
                            If the user's message clearly indicates a feature request (e.g., 'I want to play a game', 'plan a trip', 'generate an image', 'I want to be VIP', 'set email', 'set admin message'),
                            add a hidden tag at the end of your response in the format "[YÖNLENDİR: [section-name]]".
                            Example: "Elbette, size özel bir tatil planı oluşturabilirim! [YÖNLENDİR: vip-planner-section]".
                            Section names: game-section, virtual-holiday-section, ai-photo-studio-section, vip-planner-section, user-info-section, time-travel-section, destiny-route-section, ai-companion-section, payment-section, contact-us-section.`; // Korsan sahnesi artık yok

        // AI çağrısı için geçmişi dilimle (bağlamı korumak ama çok uzun istekleri önlemek için)
        const chatHistoryForAI = chatHistory.slice(Math.max(0, chatHistory.length - 10)); // Son 10 mesaj bağlam için

        const reply = await window.callOpenRouterAI(promptForAI, "openai/gpt-3.5-turbo", chatLoading, chatHistoryForAI);
        const redirectMatch = reply.match(/\[YÖNLENDİR:\s*([^\]]+)\]/);
        let cleanReply = reply.replace(/\[YÖNLENDİR:\s*([^\]]+)\]/, '').trim();

        window.displayMessage("ai", cleanReply, chatBox);
        chatHistory.push({ role: "assistant", content: cleanReply }); // AI yanıtını geçmişe ekle
        window.speak(cleanReply);
        window.updateTatilPuan(5, "Sohbet");

        if (currentUserId) {
            // Sohbet geçmişini Firestore'a kaydet
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

            // Yönlendirme seçeneği ile modal göster
            window.showModal(
                "Yönlendirme Önerisi",
                `Palmiye Kaptan, sanırım **${friendlySectionName}** bölümüyle ilgileniyorsunuz. Oraya gitmek ister misiniz?` +
                `<br><br><button id="confirmRedirectBtn" style="background-color:#00796b; color:white; padding:10px 20px; border:none; border-radius:5px; cursor:pointer;">Evet, Git!</button>` +
                `<button id="cancelRedirectBtn" style="background-color:#ccc; color:#333; padding:10px 20px; border:none; border-radius:5px; cursor:pointer; margin-left: 10px;">Hayır, Burada Kal</button>`
            );

            // Modal içindeki dinamik butonlara olay dinleyicileri ekle
            const confirmRedirectBtn = document.getElementById("confirmRedirectBtn");
            const cancelRedirectBtn = document.getElementById("cancelRedirectBtn");

            if (confirmRedirectBtn) {
                confirmRedirectBtn.onclick = () => {
                    window.showSection(targetSectionId);
                    hideModal(appModal); // Uygulama modalını kapat
                };
            }
            if (cancelRedirectBtn) {
                cancelRedirectBtn.onclick = () => {
                    hideModal(appModal); // Uygulama modalını kapat
                };
            }
        }
    }; // sendChatBtn.onclick sonu

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChatBtn.click();
    });

    // Ses kontrolü
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

    modalConfirmBtn.addEventListener("click", () => hideModal(appModal));

    // Giriş/Kayıt Modal butonları
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

    // Şifremi unuttum linki
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', () => {
            hideModal(loginModal);
            if (forgotPasswordModal) forgotPasswordModal.style.display = 'flex';
        });
    }

    // Tüm kapatma butonları için olay dinleyici
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            hideModal(event.target.closest('.modal'));
        });
    });

    // Modal dışına tıklayınca kapatma
    window.addEventListener('click', (event) => {
        if (event.target == loginModal) hideModal(loginModal);
        if (event.target == registerModal) hideModal(registerModal);
        if (event.target == forgotPasswordModal) hideModal(forgotPasswordModal);
        if (event.target == appModal) hideModal(appModal); // appModal'ı dışına tıklayarak kapatmayı sağla
    });

    // Kayıt İşlemi
    if (performRegisterBtn) {
        performRegisterBtn.addEventListener('click', async (e) => { // e parametresini ekle
            e.preventDefault(); // Formun varsayılan submit davranışını engelle
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

                // Kullanıcı verilerini Firestore'a kaydet
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
                // Firebase Cloud Function'ı çağır
                try {
                    const sendWelcomeEmailCallable = firebase.functions().httpsCallable('sendWelcomeEmail');
                    await sendWelcomeEmailCallable({ email: email, username: username });
                    console.log("Hoş geldin e-postası Cloud Function tarafından çağrıldı.");
                } catch (e) {
                    console.error("Hoş geldin e-postası Cloud Function çağrılırken hata:", e);
                    // Hata durumunda bile kullanıcıya kayıt başarılı mesajını göstermeye devam et
                }

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
    }


    // Giriş İşlemi
    if (performLoginBtn) {
        performLoginBtn.addEventListener('click', async (e) => { // e parametresini ekle
            e.preventDefault(); // Formun varsayılan submit davranışını engelle
            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (!email || !password) {
                loginMessage.textContent = 'Lütfen e-posta ve şifrenizi girin.';
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
    }


    // Şifre Sıfırlama
    if (performResetBtn) {
        performResetBtn.addEventListener('click', async (e) => { // e parametresini ekle
            e.preventDefault(); // Formun varsayılan submit davranışını engelle
            const email = resetEmailInput.value.trim();
            if (!email) {
                resetMessage.textContent = 'Lütfen e-posta adresinizi girin.';
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
    }


    // Çıkış Yapma
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

    // Tatil Avı (Oyun)
    if (startGameBtn) {
        startGameBtn.onclick = () => {
            gameActive = true;
            currentQuestionIndex = 0;
            gameScore = 0;
            if (currentUserId) { // Giriş yapmışsa puanı sıfırla
                window.updateUserProfile({ gameScore: gameScore });
            }
            gameOutput.innerHTML = `<p><strong>Palmiye Kaptan:</strong> Tatil Avı oyununa hoş geldin! Sana 3 soru soracağım. Doğru cevap verirsen PalmCoin kazanacaksın!</p>`;
            gameAnswerInput.style.display = "block";
            submitGameAnswerBtn.style.display = "block";
            startGameBtn.style.display = "none";
            window.speak("Tatil Avı oyununa hoş geldin! Sana üç soru soracağım. Doğru cevap verirsen PalmCoin kazanacaksın!");
            setTimeout(askNextGameQuestion, 2000);
        };
    }

    if (submitGameAnswerBtn) {
        submitGameAnswerBtn.onclick = () => handleGameAnswer(gameAnswerInput.value);
    }
    if (gameAnswerInput) {
        gameAnswerInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") submitGameAnswerBtn.click();
        });
    }


    async function askNextGameQuestion() {
        if (currentQuestionIndex < 3) { // Toplam 3 soru soralım
            gameOutput.innerHTML += `<p><i class="fas fa-spinner fa-spin"></i> Palmiye Kaptan yeni soru hazırlıyor...</p>`;
            gameAnswerInput.value = "";
            gameAnswerInput.focus();
            try {
                const aiResponse = await window.callOpenRouterAI(
                    `Create a short trivia question about travel, geography, or culture with 3 multiple-choice options (A, B, C) and a single correct answer.
                    Format the response as 'Soru: [Question Text] Seçenekler: (A) [Option A] (B) [Option B] (C) [Option C] Cevap: [Correct Option Letter (e.g.: A)]'.
                    Ensure options are clearly labeled (A), (B), (C). Provide in Turkish.`,
                    "openai/gpt-3.5-turbo",
                    null // Bu küçük çağrı için özel yükleme göstergesi yok
                );

                const questionMatch = aiResponse.match(/Soru:\s*(.*?)\s*Seçenekler:\s*(.*?)\s*Cevap:\s*([A-C])/i);
                if (questionMatch && questionMatch.length === 4) {
                    const questionText = questionMatch[1].trim();
                    const optionsText = questionMatch[2].trim();
                    const correctAnswer = questionMatch[3].trim().toUpperCase();

                    // Seçenekleri daha sağlam bir şekilde ayrıştır
                    const optionsArray = [];
                    const optionRegex = /\(([A-C])\)\s*([^)(]+)/g; // (A) Metin, (B) Metin eşleştir
                    let match;
                    while ((match = optionRegex.exec(optionsText)) !== null) {
                        optionsArray.push(`(${match[1].toUpperCase()}) ${match[2].trim()}`);
                    }
                    if (optionsArray.length === 0 && optionsText) { // Regex başarısız olursa, yaygın ayırıcılarla böl
                        const rawOptions = optionsText.split(/ \(B\) | \(C\) /).map(s => s.trim());
                        if (rawOptions[0]) optionsArray.push(`(A) ${rawOptions[0].replace('(A) ', '')}`);
                        if (rawOptions[1]) optionsArray.push(`(B) ${rawOptions[1].replace('(B) ', '')}`);
                        if (rawOptions[2]) optionsArray.push(`(C) ${rawOptions[2].replace('(C) ', '')}`);
                    }

                    currentGameQuestion = {
                        question: questionText,
                        options: optionsArray.length > 0 ? optionsArray : [optionsText], // Ayrıştırılmış seçenekleri veya yedeği kullan
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
        }

        async function handleGameAnswer(answer) {
            if (!currentGameQuestion) {
                gameOutput.innerHTML += `<p style="color: red;"><strong>Palmiye Kaptan:</strong> Henüz bir soru yok. Lütfen oyunu başlatın.</p>`;
                return;
            }

            const userAnswer = answer.trim().toUpperCase();
            gameAnswerInput.value = ""; // Girişi hemen temizle

            if (userAnswer === currentGameQuestion.answer) {
                gameOutput.innerHTML += `<p style="color: green;"><strong>Palmiye Kaptan:</strong> Tebrikler! Doğru cevap. (+${currentGameQuestion.points} PalmCoin)</p>`;
                window.speak("Tebrikler! Doğru cevap.");
                gameScore += currentGameQuestion.points;
                if (currentUserId) { // Giriş yapmışsa puanı güncelle
                    await window.updateUserProfile({ gameScore: gameScore });
                }
                window.updateTatilPuan(currentGameQuestion.points, `Tatil Avı Oyunu (Soru ${currentQuestionIndex + 1})`);
            } else {
                gameOutput.innerHTML += `<p style="color: red;"><strong>Palmiye Kaptan:</strong> Yanlış cevap. Doğru cevap: ${currentGameQuestion.answer}</p>`;
                window.speak(`Yanlış cevap. Doğru cevap ${currentGameQuestion.answer}`);
            }

            currentQuestionIndex++;
            if (currentQuestionIndex < 3) {
                setTimeout(askNextGameQuestion, 1500); // Soru döngüsünü düzeltildi
            } else {
                setTimeout(endGame, 1500);
            }
        }

        function endGame() {
            gameActive = false;
            gameOutput.innerHTML += `<p><strong>Palmiye Kaptan:</strong> Oyun bitti! Toplam **${gameScore} PalmCoin** kazandın! TatilPuan'ın güncellendi.</p>`;
            window.speak(`Oyun bitti! Toplam ${gameScore} PalmCoin kazandın!`);
            gameAnswerInput.style.display = "none";
            submitGameAnswerBtn.style.display = "none";
            startGameBtn.style.display = "block";
            window.displayMembershipInfo(); // Kullanıcı bilgilerini yenile
        }

        // Sanal tur dakika maliyeti güncelleme dinleyicisi
        if (virtualDurationMinutesInput) {
            virtualDurationMinutesInput.addEventListener("input", () => {
                const minutes = parseInt(virtualDurationMinutesInput.value) || 0;
                virtualTourCostEl.textContent = (minutes * VIRTUAL_TOUR_COST_PER_MINUTE);
            });
        }


        if (startVirtualBtn) {
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

                // Kullanıcı puanını düş ve modali göster
                await window.updateTatilPuan(-totalCost, `Sanal Tatil Oluşturma (${city}, ${days} gün)`);
                window.showModal("Ödeme Alındı", `${totalCost} PalmCoin bakiyenizden düşüldü. Sanal tatiliniz hazırlanıyor...`);

                const storyPrompt = `Please write a ${days}-day virtual holiday story for ${city}, lasting ${minutes} minutes.
                                    The holiday should include activities like: ${activities}. Describe the places to visit, tastes to try, and experiences to live in detail.
                                    The story should be engaging, immersive, and creative.
                                    Create a separate paragraph for each day. At the end of each paragraph, add a short and descriptive image prompt for an image related to that day in the format "(GÖRSEL-PROMPT: [Image Description])".
                                    Make sure to include at least ${days} image prompts.
                                    General gift image prompt: "${imagePrompt}". You can use this as a theme throughout the story.
                                    Provide the response in Turkish.`;

                const reply = await window.callOpenRouterAI(storyPrompt, "openai/gpt-3.5-turbo", virtualLoading); // prompt yerine storyPrompt kullanıldı
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

                // Hediye görselini oluştur
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

                // Günlük görselleri oluştur (eğer varsa)
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
        }


        if (sendVirtualImageEmailBtn) {
            sendVirtualImageEmailBtn.onclick = async () => {
                if (!generatedVirtualImageUrl) {
                    window.showModal("Hata", "Önce bir sanal tatil resmi oluşturmalısınız.");
                    return;
                }

                let emailToSendTo = userEmail;
                if (emailToSendTo === "Ayarlanmadı" || !emailToSendTo) { // Boş string kontrolü de ekle
                    const newEmail = prompt("Hediye resmi göndermek için lütfen e-posta adresinizi girin:");
                    if (newEmail && newEmail.trim() !== "") {
                        emailToSendTo = newEmail.trim();
                        if (currentUserId) { // Giriş yapmışsa e-postayı güncelle
                            await window.updateUserProfile({ email: emailToSendTo });
                        }
                        window.displayMembershipInfo();
                    } else {
                        window.showModal("İptal Edildi", "E-posta adresi girilmediği için işlem iptal edildi.");
                        return;
                    }
                }
                // Cloud Function'ı çağır
                try {
                    const sendWelcomeEmailCallable = firebase.functions().httpsCallable('sendWelcomeEmail'); // sendWelcomeEmail adını yeniden kullanıyoruz, daha geneli için değiştirilebilir
                    await sendWelcomeEmailCallable({ email: emailToSendTo, username: userName || "Değerli Kullanıcımız", imageUrl: generatedVirtualImageUrl, subject: "Sanal Tatil Hediye Resminiz!" });
                    window.showModal("E-posta Gönderiliyor", `Hediye resminiz ${emailToSendTo} adresine gönderildi.`);
                    window.speak("Hediye resminiz e-postanıza gönderildi.");
                } catch (e) {
                    console.error("Hediye resmini gönderirken Cloud Function hatası:", e);
                    window.showModal("Hata", `Hediye resmi gönderilirken bir hata oluştu: ${e.message}`);
                }
            };
        }


        // AI Fotoğraf Stüdyosu Logic
        if (goToAiPhotoPaymentBtn) {
            goToAiPhotoPaymentBtn.onclick = () => window.showSection("payment-section");
        }


        if (generateAiPhotoButton) {
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
                        imgElement.alt = `AI Photo ${i + 1}: ${promptText}`;
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
        }


        if (downloadAllImagesBtn) {
            downloadAllImagesBtn.onclick = async () => {
                if (currentGeneratedImages.length === 0) {
                    window.showModal("Hata", "Önce fotoğraf oluşturmalısınız.");
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
                generatedImagesContainer.innerHTML = '';
                downloadAllImagesBtn.style.display = 'none';
                aiPhotoOutput.style.display = 'none';
            };
        }


        // VIP Planlayıcı Logic
        if (goToVipPaymentBtn) {
            goToVipPaymentBtn.onclick = () => window.showSection("payment-section");
        }


        vipBudgetButtons.forEach(button => {
            button.onclick = () => {
                vipBudgetButtons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
                selectedBudget = button.dataset.budget;
            };
        });

        if (generateVipPlanBtn) {
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
                currentVipPlan = ""; // Mevcut VIP planı sıfırla

                const prompt = `Please create a very detailed, comprehensive, and personalized A-to-Z holiday plan for ${destination} for ${duration} days, for ${travelers} people, with a ${selectedBudget} budget, and a ${travelType} theme.
                                Include flight suggestions (example airline and approximate price range), hotel suggestions (example hotel name, price range, proximity to location, and features), airport transfer suggestions (how to do it, approximate cost), daily detailed places to visit/activities/food suggestions (specific places and tastes for morning, noon, and evening).
                                All suggestions should be suitable for this budget. Provide example links (like Booking.com, Skyscanner, TripAdvisor, a random Unsplash image link).
                                Provide the response in Turkish. Enrich the details, include small details, not just main outlines.`;

                const reply = await window.callOpenRouterAI(prompt, "openai/gpt-3.5-turbo", vipPlannerLoading);
                currentVipPlan = reply;
                let planContent = reply;

                // AI yanıtından olası bir görsel URL'si bulmak için Regex
                const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpe?g|gif|webp|unsplash\.com\/\S+|pixabay\.com\/\S+))/i;
                const match = planContent.match(urlRegex);
                let mediaHtml = "";
                if (match) {
                    mediaHtml = `<br><img src="${match[0]}" alt="${destination} Planı">`;
                    planContent = planContent.replace(match[0], '').trim();
                } else {
                    // AI özel bir görsel URL'si sağlamazsa, genel bir görsel oluşturma API'ı çağır
                    const genericImageUrl = await window.callImageGenerationAI(`${destination} plan`, null); // Prompt'u daha genel yapıldı
                    if (genericImageUrl) {
                        mediaHtml = `<br><img src="${genericImageUrl}" alt="${destination} Planı">`;
                    } else {
                        mediaHtml = `<br><p style="color:red;">Görsel oluşturulamadı.</p>`;
                    }
                }

                vipPlanOutput.innerHTML = `<h4>${destination} için ${duration} Günlük VIP Tatil Planınız:</h4><p>${planContent.replace(/\n/g, '<br>')}</p>${mediaHtml}`; // Yeni satırları <br> ile değiştir
                vipPlanOutput.style.display = "block";
                vipPlanChatArea.style.display = "block";
                window.speak(`${destination} için VIP tatil planınız hazır.`);
                await window.updateTatilPuan(100, `VIP Plan Oluşturma (${destination})`);
            };
        }


        // VIP Plan hakkında soru sorma
        if (sendVipPlanMessageBtn) {
            sendVipPlanMessageBtn.onclick = async () => {
                const userQuestion = vipPlanInput.value.trim();
                if (!userQuestion) return;

                if (tatilPuan < VIP_PLAN_CHAT_COST) {
                    window.showModal("Yetersiz PalmCoin", `Bu soru için ${VIP_PLAN_CHAT_COST} PalmCoin'e ihtiyacınız var. Mevcut PalmCoin: ${tatilPuan}.`);
                    return;
                }

                window.displayMessage("user", userQuestion, vipPlanChatBox);
                vipPlanInput.value = "";

                await window.updateTatilPuan(-VIP_PLAN_CHAT_COST, "VIP Plan Detay Sorgusu");

                const prompt = `User's previously generated VIP travel plan (with all details): "${currentVipPlan}".
                                User's new question about this plan: "${userQuestion}".
                                Based on this plan and question, provide an informative and detailed response.
                                Elaborate only on the relevant part and do not repeat the entire plan.
                                Provide the response in Turkish.`;

                const reply = await window.callOpenRouterAI(prompt, "openai/gpt-3.5-turbo", vipPlannerLoading);
                window.displayMessage("ai", reply, vipPlanChatBox);
                vipPlanChatBox.scrollTop = vipPlanChatBox.scrollHeight; // companionChatBox yerine vipPlanChatBox kullanıldı
                window.speak(reply);
            };
        }

        if (vipPlanInput) {
            vipPlanInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") sendVipPlanMessageBtn.click();
            });
        }


        // Niş Tur Planı Logic
        if (generateNichePlanBtn) {
            generateNichePlanBtn.onclick = async () => {
                const nicheTopic = nicheTopicInput.value.trim();
                const nicheDetails = nicheDetailsTextarea.value.trim();

                if (!nicheTopic || !nicheDetails) {
                    window.showModal("Eksik Bilgi", "Lütfen niş konuyu ve özel isteklerinizi detaylıca girin.");
                    return;
                }
                if (userMembershipLevel !== "Altın") {
                    window.showModal("Erişim Reddedildi", "Bu özellik sadece Altın üyelere özeldir. Lütfen üyeliğinizi yükseltin.");
                    return;
                }

                nichePlanOutput.style.display = "none";

                const prompt = `User's niche travel topic: "${nicheTopic}". Special requests: "${nicheDetails}".
                                Based on this information, plan the user's dream niche tour in a very detailed, unusual, creative, and truly bespoke service manner.
                                Suggest possible destinations, unique activities, special accommodation options, and experiences suitable for the niche topic.
                                Present the plan in a friendly and inspiring tone, in Turkish.
                                If appropriate, suggest an image link relevant to that niche topic (e.g., an Unsplash or Pixabay link).`;

                const reply = await window.callOpenRouterAI(prompt, "openai/gpt-3.5-turbo", nichePlanLoading);
                let nichePlanContent = reply;
                const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpe?g|gif|webp|unsplash\.com\/\S+|pixabay\.com\/\S+))/i;
                const match = nichePlanContent.match(urlRegex);
                let mediaHtml = "";
                if (match) {
                    mediaHtml = `<br><img src="${match[0]}" alt="${nicheTopic} Niş Planı">`;
                    nichePlanContent = nichePlanContent.replace(match[0], '').trim();
                } else {
                    const genericImageUrl = await window.callImageGenerationAI(`${nicheTopic} travel`, null); // Görsel oluşturma API'ı çağrısı
                    if (genericImageUrl) {
                        mediaHtml = `<br><img src="${genericImageUrl}" alt="${nicheTopic} Niş Planı">`;
                    } else {
                        mediaHtml = `<br><p style="color:red;">Görsel oluşturulamadı.</p>`;
                    }
                }

                nichePlanOutput.innerHTML = `<h4>Özel Niş Tur Planınız - "${nicheTopic}":</h4><p>${nichePlanContent.replace(/\n/g, '<br>')}</p>${mediaHtml}`; // Yeni satırları <br> ile değiştir
                nichePlanOutput.style.display = "block";
                window.speak(`Niş tur planınız hazır!`);
                await window.updateTatilPuan(150, `Niş Plan Oluşturma (${nicheTopic})`);
            };
        }


        // Kullanıcı adı güncelleme butonu (ID: update-username-btn olarak güncellendi)
        if (updateUsernameBtn) {
            updateUsernameBtn.onclick = async () => {
                const newName = prompt("Lütfen yeni kullanıcı adınızı girin:", userName); // Varsayılan olarak mevcut adı göster
                if (newName && newName.trim() !== "" && newName.trim() !== userName) { // Boş veya aynı isim değilse güncelle
                    userName = newName.trim();
                    if (currentUserId) { // Giriş yapmışsa kullanıcı adını güncelle
                        await auth.currentUser.updateProfile({ displayName: userName }); // Firebase Auth display name'i güncelle
                        await window.updateUserProfile({ username: userName }); // Firestore 'username' alanını güncelle
                    }
                    window.showModal("Hoş Geldin!", `Hoş geldin, **${newName}**! Kullanıcı adınız güncellendi.`);
                    window.speak(`Hoş geldin ${newName}!`);
                    window.displayMembershipInfo(); // UI'yi güncelle
                } else if (newName !== null && newName.trim() === "") { // Kullanıcı boş string girerse
                    window.showModal("Uyarı", "Kullanıcı adı boş bırakılamaz.");
                }
            };
        }


        // E-posta ayarlama/güncelleme butonu
        if (setuserEmailBtn) {
            setuserEmailBtn.onclick = async () => {
                const newEmail = prompt("Lütfen e-posta adresinizi girin:", userEmail !== "Ayarlanmadı" ? userEmail : ''); // Mevcut e-postayı göster
                if (newEmail && newEmail.trim() !== "" && newEmail.trim() !== userEmail) { // Boş veya aynı e-posta değilse güncelle
                    userEmail = newEmail.trim();
                    if (currentUserId) { 
                        await window.updateUserProfile({ email: userEmail });
                    }
                    window.showModal("E-posta Güncellendi", `E-posta adresiniz **${userEmail}** olarak güncellendi.`);
                    window.speak(`E-posta adresiniz ${userEmail} olarak güncellendi.`);
                    window.displayMembershipInfo(); // UI'yi güncelle
                } else if (newEmail !== null && newEmail.trim() === "") { // Kullanıcı boş string girerse
                    window.showModal("Bilgi", "E-posta girilmediği için mevcut e-posta değişmedi.");
                }
            };
        }


        // Yönetici Mesajı Güncelleme Logic
        if (updateAdminMessageBtn) {
            updateAdminMessageBtn.onclick = async () => {
                const message = adminMessageInput.value.trim();
                if (!message) {
                    window.showModal("Uyarı", "Lütfen yayınlamak istediğiniz mesajı girin.");
                    return;
                }
                // Cloud Function'ı çağır
                await window.updateAdminMessage(message);
            };
        }


        // Zamanda Yolculuk Tatili Logic
        if (goToTimeTravelPaymentBtn) {
            goToTimeTravelPaymentBtn.onclick = () => window.showSection("payment-section");
        }


        if (startTimeTravelBtn) {
            startTimeTravelBtn.onclick = async () => {
                const era = timeTravelEraInput.value.trim();
                const duration = parseInt(timeTravelDurationInput.value);
                const character = timeTravelCharacterInput.value.trim();
                const focus = timeTravelFocusInput.value.trim();

                if (!era || isNaN(duration) || duration < 1) {
                    window.showModal("Eksik Bilgi", "Lütfen geçerli bir dönem ve gün sayısı girin.");
                    return;
                }
                if (userMembershipLevel !== "Altın") {
                    window.showModal("Erişim Reddedildi", "Bu özellik sadece Altın üyelere özeldir. Lütfen üyeliğinizi yükseltin.");
                    return;
                }

                timeTravelOutput.style.display = "none";

                const prompt = `Please create a ${duration}-day time travel holiday story set in the "${era}" period.
                                Describe the atmosphere, important events, clothing, food, and potential interactions of that era in a detailed, immersive, and imaginative way.
                                ${character ? `In this journey, specifically include an opportunity to meet or interact with "${character}".` : ''}
                                ${focus ? `The theme "${focus}" should be prominent as a focal point.` : ''}
                                The story should be engaging and include an image link relevant to that period (e.g., an Unsplash or Pixabay link).
                                Provide the response in Turkish. Focus on details.`;

                const reply = await window.callOpenRouterAI(prompt, "openai/gpt-3.5-turbo", timeTravelLoading);
                let storyContent = reply;

                const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpe?g|gif|webp|unsplash\.com\/\S+|pixabay\.com\/\S+))/i;
                const match = storyContent.match(urlRegex);
                let mediaHtml = "";
                if (match) {
                    mediaHtml = `<br><img src="${match[0]}" alt="${era} Dönemi">`;
                    storyContent = storyContent.replace(match[0], '').trim();
                } else {
                    const genericImageUrl = await window.callImageGenerationAI(`${era} travel`, null); // Görsel oluşturma API'ı çağrısı
                    if (genericImageUrl) {
                        mediaHtml = `<br><img src="${genericImageUrl}" alt="${era} Dönemi">`;
                    } else {
                        mediaHtml = `<br><p style="color:red;">Görsel oluşturulamadı.</p>`;
                    }
                }

                timeTravelOutput.innerHTML = `<h4>${era} Döneminde Zaman Yolculuğu Tatiliniz:</h4><p>${storyContent.replace(/\n/g, '<br>')}</p>${mediaHtml}`;
                timeTravelOutput.style.display = "block";
                window.speak(`${era} dönemine yolculuk hikayeniz hazır.`);
                await window.updateTatilPuan(75, `Zamanda Yolculuk (${era})`);
            };
        }


        // Kader Rotası Logic
        if (predictDestinyBtn) {
            predictDestinyBtn.onclick = async () => {
                const age = destinyAgeInput.value.trim();
                const hobby = destinyHobbyInput.value.trim();
                const destinyDream = destinyDreamInput.value.trim();
                const destinyColor = destinyColorInput.value.trim();

                if (!age || !hobby || !destinyDream) {
                    window.showModal("Eksik Bilgi", "Lütfen yaşınızı, hobinizi ve hayalinizi girin.");
                    return;
                }

                destinyRouteOutput.style.display = "none";
                realizeDestinyBtn.style.display = "none";

                const prompt = `Based on the following user information, predict their future "destiny holiday" or "dream vacation" in an absurd, fun, and imaginative way.
                                This prediction should be like a prophecy. For example, start with "According to Palmiye Kaptan's crystal ball, in 20XX..."
                                The prediction can include a destination, a hypothetical event specific to that year, and even characters (generated by AI) they might meet there.
                                User information: Age: ${age}, Hobby: ${hobby}, Dream: ${destinyDream}. ${destinyColor ? `Favorite color: ${destinyColor}.` : ''}
                                Subtly incorporate this color into the atmosphere or locations of the prophecy.
                                Provide the response in Turkish and include an encouraging, attractive message for VIP membership (e.g., "Making this destiny a reality is exclusive to Gold Members!").
                                Be more creative and humorous. Add a visual imaginative description related to the prophecy in the format "(GÖRSEL: [image description])".`;

                const reply = await window.callOpenRouterAI(prompt, "openai/gpt-3.5-turbo", destinyLoading);
                let destinyContent = reply;
                const imageMatch = destinyContent.match(/\(GÖRSEL:\s*([^)]+)\)/);
                let destinyMediaHtml = "";
                let destinyImagePrompt = "";
                if (imageMatch && imageMatch[1]) {
                    destinyImagePrompt = imageMatch[1].trim();
                    destinyContent = destinyContent.replace(imageMatch[0], '').trim();
                }

                destinyRouteOutput.innerHTML = `<h4>Kader Rotanızın Kehaneti:</h4><p>${destinyContent.replace(/\n/g, '<br>')}</p>`;

                if (destinyImagePrompt) {
                    const imageUrl = await window.callImageGenerationAI(destinyImagePrompt, destinyLoading);
                    if (imageUrl) {
                        destinyMediaHtml = `<br><img src="${imageUrl}" alt="Kader Rotası Görseli" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">`;
                        destinyRouteOutput.innerHTML += destinyMediaHtml;
                    }
                }

                destinyRouteOutput.style.display = "block";
                window.speak("Kader rotanız hazırlandı!");
                realizeDestinyBtn.style.display = "block";
                await window.updateTatilPuan(40, "Kader Rotası Kehaneti");
            };
        }


        if (realizeDestinyBtn) {
            realizeDestinyBtn.onclick = () => {
                if (userMembershipLevel === "Altın") {
                    window.showModal("Kader Gerçekleşiyor!", "Harika! Altın üye olarak kader rotanızı gerçeğe dönüştürme zamanı. VIP Tur Planlayıcıya yönlendiriliyorsunuz.");
                    window.showSection("vip-planner-section");
                } else {
                    window.showModal("Erişim Reddedildi", "Kader rotanızı gerçeğe dönüştürmek Altın üyelere özeldir. Lütfen üyeliğinizi yükseltin!");
                    window.showSection("payment-section");
                }
            };
        }


        // AI Yoldaşım Logic
        if (createCompanionBtn) {
            createCompanionBtn.onclick = async () => {
                const companionName = companionInput.value.trim();
                const personality = companionPersonalitySelect.value;

                if (!companionName) {
                    window.showModal("Eksik Bilgi", "Lütfen yoldaşınıza bir isim verin.");
                    return;
                }

                companionChatArea.style.display = "none";
                companionChatBox.innerHTML = '';
                companionChatHistory = []; // Yeni yoldaş için geçmişi sıfırla

                const prompt = `Please create an AI companion character named "${companionName}" with a "${personality}" personality, specializing in travel.
                                Write a short, friendly introductory text for them and make their first greeting. Provide the response in Turkish. Be creative.`;

                const reply = await window.callOpenRouterAI(prompt, "openai/gpt-3.5-turbo", companionLoading);
                aiCompanion = { name: companionName, personality: personality, intro: reply };

                activeCompanionName.textContent = companionName;
                window.displayMessage("ai", aiCompanion.intro, companionChatBox);
                companionChatHistory.push({ role: "assistant", content: aiCompanion.intro });
                companionChatArea.style.display = "block";
                window.speak(`${companionName} adında, ${personality} kişiliğe sahip yoldaşınız oluşturuldu.`);
                await window.updateTatilPuan(30, `AI Yoldaş Oluşturma (${companionName})`);
            };
        }


        if (sendCompanionMessageBtn) {
            sendCompanionMessageBtn.onclick = async () => {
                const userMessage = companionInput.value.trim();
                if (!userMessage) return;

                window.displayMessage("user", userMessage, companionChatBox);
                companionChatHistory.push({ role: "user", content: userMessage });
                companionInput.value = "";

                if (!aiCompanion) {
                    window.showModal("Hata", "Önce bir AI Yoldaşı oluşturmalısın!");
                    return;
                }

                const maxHistoryLength = 5; // Bağlam için son 5 mesajı tut
                const recentHistory = companionChatHistory.slice(Math.max(0, companionChatHistory.length - maxHistoryLength));

                const systemMessage = {
                    role: "system",
                    content: `Your name is ${aiCompanion.name} and your personality is ${aiCompanion.personality}. The user's name is ${userName}.
                                Help the user with travel and holiday topics. Provide creative, friendly, and conversational responses in line with your personality.
                                Maintain context by considering the user's previous messages.`
                };
                // Sistem mesajını her zaman ilk mesaj olarak gönder
                const messagesToSend = [systemMessage, ...recentHistory];

                // callOpenRouterAI'yi, mevcut geçmişi ve son kullanıcı mesajını içerecek şekilde çağır
                // OpenRouter API, messages dizisi bekler.
                const reply = await window.callOpenRouterAI(null, "openai/gpt-3.5-turbo", companionLoading, messagesToSend);

                window.displayMessage("ai", reply, companionChatBox);
                companionChatHistory.push({ role: "assistant", content: reply });
                companionChatBox.scrollTop = companionChatBox.scrollHeight;
                window.speak(reply);
            };
        }

        // Ödeme bölümü butonları
        if (completePaymentBtn) {
            completePaymentBtn.onclick = () => {
                window.showModal("Ödeme Başarılı (Demo)", "Ödeme işleminiz başarıyla tamamlandı! Artık Altın Üyesiniz. Uygulamayı yeniden yükleyerek yeni özelliklere erişebilirsiniz.");
                // Demo amaçlı üyelik seviyesini Altın yap
                userMembershipLevel = "Altın";
                if (currentUserId) {
                    window.updateUserProfile({ membershipLevel: "Altın" });
                }
                window.displayMembershipInfo();
                // Modalı kapat
                hideModal(document.getElementById('payment-section').closest('.modal') || document.getElementById('appModal'));
                // Sayfayı yenileme veya ilgili bölümleri güncelleme
                window.showSection("user-info-section"); // Kullanıcı bilgileri bölümüne yönlendir
            };
        }

        // Bize Ulaşın formu gönder butonu
        if (sendContactFormBtn) {
            sendContactFormBtn.onclick = async () => {
                const subject = contactSubjectInput.value.trim();
                const email = contactEmailInput.value.trim();
                const message = contactMessageInput.value.trim();
                const file = contactFileInput.files[0]; // İlk dosyayı al

                if (!subject || !email || !message) {
                    window.showModal("Eksik Bilgi", "Lütfen Konu, E-posta ve Mesaj alanlarını doldurun.");
                    return;
                }

                contactLoading.style.display = 'block';

                try {
                  
                    const sendContactEmailCallable = firebase.functions().httpsCallable('sendContactEmail');

                    let fileDownloadUrl = null;
                    if (file) {
                        // Dosyayı Firebase Storage'a yükle
                        const storageRef = storage.ref();
                        const fileRef = storageRef.child(`contact_uploads/${currentUserId || 'anonymous'}/${Date.now()}_${file.name}`);
                        const snapshot = await fileRef.put(file);
                        fileDownloadUrl = await snapshot.ref.getDownloadURL();
                        console.log("Dosya yüklendi:", fileDownloadUrl);
                    }

                    await sendContactEmailCallable({
                        subject: subject,
                        fromEmail: email,
                        message: message,
                        attachmentUrl: fileDownloadUrl // Dosya URL'sini Cloud Function'a gönder
                    });

                    window.showModal("Başarılı", "Mesajınız başarıyla gönderildi. En kısa sürede size geri döneceğiz.");
                    // Formu temizle
                    contactSubjectInput.value = '';
                    contactEmailInput.value = userEmail !== "Ayarlanmadı" ? userEmail : '';
                    contactMessageInput.value = '';
                    if (contactFileInput) contactFileInput.value = ''; // Dosya inputunu temizle
                } catch (error) {
                    console.error("Mesaj gönderilirken hata oluştu:", error);
                    window.showModal("Hata", `Mesajınız gönderilirken bir hata oluştu: ${error.message}. Lütfen daha sonra tekrar deneyin.`);
                } finally {
                    contactLoading.style.display = 'none';
                }
            };
        }
    }; 
}); // Bu satırı ekleyin