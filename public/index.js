// index.js

// --- Firebase v9 Modüler SDK import'ları ---
// Bu importlar, window objesine atanacak Firebase servislerinden direkt kullanılacak fonksiyonları getirir.
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// collection, doc, setDoc, onSnapshot, addDoc gibi fonksiyonları direkt kullanmak için import edin.
import { collection, doc, setDoc, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-functions.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpxneBV1JQQdyvhPqtt6OG_jl0WbyAMUU",
  authDomain: "tatilkaptanifinal.firebaseapp.com",
  projectId: "tatilkaptanifinal",
  storageBucket: "tatilkaptanifinal.firebasestorage.app",
  messagingSenderId: "748801975441",
  appId: "1:748801975441:web:cc26b7b825fafe44658b30",
  measurementId: "G-0BQJQ25XX1"
};

const app = initializeApp(firebaseConfig);

// Tüm DOM elementleri, betik yüklendiğinde bir kez tanımlanır.
// Bu sayede tüm fonksiyonlar bu referanslara erişebilir.

// Header ve Yetkilendirme Bölümleri
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authButtons = document.getElementById('authButtons');
const loggedInUserSection = document.getElementById('loggedInUser');
const usernameDisplay = document.getElementById('usernameDisplay');
const userIdDisplay = document.getElementById("user-id-display"); // UID göstergesi

// Sohbet Asistanı Bölümü
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("user-input-chat");
const sendChatBtn = document.getElementById("send-button-chat");
const chatLoading = document.getElementById("chat-loading");
const tatilpuanTop = document.getElementById("tatilpuan-top"); // Üst bar TatilPuan göstergesi
const sloganTop = document.getElementById("slogan-top"); // Üst bar slogan
const voiceToggleTop = document.getElementById("voice-toggle-top"); // Ses açma/kapatma butonu
const languageSelect = document.getElementById("language-select"); // Dil seçimi

// Modallar (Genel Uygulama, Giriş, Kayıt, Şifre Sıfırlama)
const appModal = document.getElementById("appModal"); // Düzeltildi: ID "appModal" olmalı
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");

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
const closeButtons = document.querySelectorAll('.close-button'); // Tüm modal kapatma butonları

// Tatil Avı (Oyun) Bölümü
const startGameBtn = document.getElementById("startQuizBtn");
const gameOutput = document.getElementById("game-output");
const gameAnswerInput = document.getElementById("game-answer-input");
const submitGameAnswerBtn = document.getElementById("submit-game-answer-btn");

// Sanal Tatil Planı Bölümü
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

// AI Fotoğraf Stüdyosu Bölümü
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

// VIP Planlayıcı Bölümü
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
let selectedBudget = ""; // Varsayılan boş bırakıldı, buton tıklamasıyla atanır
const vipPlanChatArea = document.getElementById("vip-plan-chat-area");
const vipPlanChatBox = document.getElementById("vip-plan-chat-box");
const vipPlanInput = document.getElementById("vip-plan-input");
const sendVipPlanMessageBtn = document.getElementById("send-vip-plan-message-btn");

// Niş Tur Talebi Bölümü
const nicheTopicInput = document.getElementById("niche-topic");
const nicheDetailsTextarea = document.getElementById("niche-details");
const generateNichePlanBtn = document.getElementById("generate-niche-plan-btn");
const nichePlanLoading = document.getElementById("niche-plan-loading");
const nichePlanOutput = document.getElementById("niche-plan-output");

// Kullanıcı Bilgileri Bölümü
const displayUserId = document.getElementById("display-userid");
const displayUsername = document.getElementById("display-username");
const displayUserEmail = document.getElementById("display-user-email");
const setuserEmailBtn = document.getElementById("set-user-email-btn");
const displayTatilpuan = document.getElementById("display-tatilpuan");
const displayMembershipLevel = document.getElementById("display-membership-level");
const displayGameScore = document.getElementById("display-game-score");
const updateUsernameBtn = document.getElementById("update-username-btn");
const palmCoinHistoryList = document.getElementById("palmcoin-history-list");

// Yönetici Mesajı Bölümü
const adminMessageInput = document.getElementById("admin-message-input");
const updateAdminMessageBtn = document.getElementById("update-admin-message-btn");
const adminMessageLoading = document.getElementById("admin-message-loading");
const adminDisplayMessageEl = document.getElementById("admin-display-message");

// Zamanda Yolculuk Bölümü
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

// Kader Rotası Bölümü
const destinyAgeInput = document.getElementById("destiny-age");
const destinyHobbyInput = document.getElementById("destiny-hobby");
const destinyDreamInput = document.getElementById("destiny-dream");
const destinyColorInput = document.getElementById("destiny-color");
const predictDestinyBtn = document.getElementById("predict-destiny-btn");
const destinyLoading = document.getElementById("destiny-loading");
const destinyRouteOutput = document.getElementById("destiny-route-output");
const realizeDestinyBtn = document.getElementById("realize-destiny-btn");

document.addEventListener('DOMContentLoaded', () => {
    // AI Yoldaşım Bölümü
    const companionNameInput = document.getElementById("companion-name");
    const companionPersonalitySelect = document.getElementById("companion-personality");
    const createCompanionBtn = document.getElementById("create-companion-btn");
    const companionLoading = document.getElementById("companion-loading");
    const companionInput = document.getElementById("companion-input");
    const companionChatBox = document.getElementById("companion-chat-box");
    const companionChatArea = document.getElementById("companion-chat-area");
    const activeCompanionName = document.getElementById("active-companion-name");
    const sendCompanionMessageBtn = document.getElementById("send-companion-message-btn");

    // — Tatil Avı (Mini Oyun) Bölümü —
const startQuizBtn        = document.getElementById("startQuizBtn");
const gameOutput          = document.getElementById("game-output");
const gameAnswerInput     = document.getElementById("game-answer-input");
const submitGameAnswerBtn = document.getElementById("submit-game-answer-btn");

startQuizBtn.addEventListener("click", async () => {
  try {
    // Buraya kendi Cloud Function çağrınızı koyabilirsiniz.
    // Örnek sabit soru:
    const soru = "Türkiye'nin başkenti neresidir?";

    // Soruyu ekrana yaz
    window.displayMessage('ai', `Soru: ${soru}`, gameOutput);

    // Cevap kutusunu ve butonunu göster
    gameAnswerInput.style.display     = "block";
    submitGameAnswerBtn.style.display = "inline-block";
  } catch (err) {
    console.error(err);
    window.displayMessage('ai', `Hata: ${err.message}`, gameOutput);
  }
});
    // Mesaj gönderme işlemi
    if (sendCompanionMessageBtn) {
        sendCompanionMessageBtn.onclick = async () => {
            const message = companionInput.value.trim();
            const companionId = aiCompanion ? aiCompanion.id : null;

            if (!message) {
                alert("Lütfen bir mesaj yazın.");
                return;
            }

            if (!companionId) {
                alert("AI Yoldaş seçilmedi veya oluşturulmadı.");
                return;
            }

            try {
                sendCompanionMessageBtn.disabled = true; // Spam engelleme
                const result = await sendCompanionMessage({ message, companionId });
                const aiResponse = result.data.response;

                // Sohbet kutusuna kullanıcı ve AI mesajlarını ekle
                companionChatBox.innerHTML += `<div><b>Sen:</b> ${message}</div>`;
                companionChatBox.innerHTML += `<div><b>AI Yoldaş:</b> ${aiResponse}</div>`;
                companionInput.value = ""; // Mesaj kutusunu temizle

                // Sohbeti sonuna kaydır
                companionChatBox.scrollTop = companionChatBox.scrollHeight;
            } catch (error) {
                console.error("Hata:", error);
                alert("Mesaj gönderilirken bir hata oluştu.");
            } finally {
                sendCompanionMessageBtn.disabled = false; // Butonu tekrar aktif hale getir
            }
        };
    } else {
        console.error("sendCompanionMessageBtn bulunamadı!");
    }

    // Diğer event listener'lar burada olabilir...
});

// Ödeme Bölümü
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

// Sidebar ve Content Section'lar için genel referanslar
const sidebarButtons = document.querySelectorAll(".sidebar-nav button");
const contentSections = document.querySelectorAll(".content-section");


// --- Genel UI ve Yardımcı Fonksiyonlar (DOMContentLoaded dışında tanımlanmalı) ---

// window.hideModal, window.showModal, window.displayMessage fonksiyonları HTML içinde tanımlandı.
// Bu sayede index.js yüklenmeden önce bile erişilebilirler.

/**
 * Metni sesli olarak okur.
 * @param {string} text - Okunacak metin.
 */
window.speak = function(text) {
    const languageSelectEl = document.getElementById("language-select");
    if (!languageSelectEl || !voiceEnabled || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    // Dil kodunu SpeechSynthesis için uygun formata getir (örn: "tr-TR", "en-US")
    let langCode = languageSelectEl.value;
    if (langCode === 'tr') langCode = 'tr-TR';
    else if (langCode === 'en') langCode = 'en-US';
    
    utterance.lang = langCode;
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

    // Geçmişin son 20 kaydını tut
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

    // Profil güncelleme fonksiyonu
    async function updateProfileIfNeeded() {
        if (currentUserId) {
            await window.updateUserProfile({
                tatilPuanlari: tatilPuan,
                membershipLevel: userMembershipLevel,
                palmCoinHistory: palmCoinHistory,
                gameScore: gameScore
            });
            console.log("Profil başarıyla güncellendi!");

            if (oldLevel !== userMembershipLevel) {
                window.showModal("Tebrikler!", `Üyelik seviyeniz **${userMembershipLevel}** seviyesine yükseldi! Yeni özelliklere göz atın.`);
                window.speak(`Tebrikler! Üyelik seviyeniz ${userMembershipLevel} seviyesine yükseldi!`);
            }
        } else {
            console.log("Kullanıcı giriş yapmamış, güncelleme yapılmadı.");
        }
    }
    await updateProfileIfNeeded();
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
    // En yeni kayıtları üstte göstermek için ters çevir
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
        section.style.display = "none"; // Tüm bölümleri gizle
        section.classList.remove("active"); // Tüm aktif sınıfları kaldır
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = "flex"; // Gösterilecek bölümü flex olarak ayarla (CSS'e göre)
        activeSection.classList.add("active"); // Aktif sınıfını ekle
    }

    sidebarButtons.forEach(button => button.classList.remove("active")); // Tüm sidebar butonlarından aktif sınıfını kaldır
    const activeButton = document.querySelector(`.sidebar-nav button[data-section='${sectionId}']`);
    if (activeButton) {
        activeButton.classList.add("active"); // Sadece ilgili butona aktif sınıfını ekle
    }

    // Bölüme özel ek ayarlar
    if (sectionId === "vip-planner-section") {
        if (vipAccessCheck && vipPlannerFormArea) {
            window.checkVipAccess(vipAccessCheck, vipPlannerFormArea, "Altın");
        }
        // Niche request alanı da VIP Planner section içindeyse onun da kontrolü
        const nicheVipRequestArea = document.getElementById("niche-vip-request-area");
        if (vipAccessCheck && nicheVipRequestArea) {
             window.checkVipAccess(vipAccessCheck, nicheVipRequestArea, "Altın");
        }
        if (vipPlanChatArea) vipPlanChatArea.style.display = 'none';
        if (vipPlanOutput) vipPlanOutput.style.display = 'none';
        currentVipPlan = "";
    } else if (sectionId === "time-travel-section") {
        if (timeTravelAccessCheck && timeTravelFormArea) {
            window.checkVipAccess(timeTravelAccessCheck, timeTravelFormArea, "Altın");
        }
    } else if (sectionId === "ai-photo-studio-section") {
        if (aiPhotoAccessCheck && aiPhotoFormArea) {
            window.checkVipAccess(aiPhotoAccessCheck, aiPhotoFormArea, "Altın");
        }
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
        // functions objesi HTML'de global olarak tanımlandığı için doğrudan kullanılabilir.
        // typeof functions kontrolü, functions objesinin yüklenip yüklenmediğini garanti eder.
        const functions = getFunctions();
        if (typeof functions === 'undefined' || !functions.httpsCallable) {
            throw new Error("Firebase Functions SDK yüklenmemiş veya başlatılmamış.");
        }
        const callAI = httpsCallable(functions, 'callOpenRouterAI');
        const result = await callAI({ prompt: prompt, model: model, chatHistory: currentChatHistory });
        return result.data.reply;
    } catch (error) {
        console.error("OpenRouter AI Cevap Hatası (Cloud Function):", error);
        let errorMessage = `Bir AI hatası oluştu: ${error.message}.`;
        if (error.code === 'unavailable') {
            errorMessage += " Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.";
        } else if (error.code === 'unauthenticated') {
            errorMessage += " Bu işlem için kimlik doğrulama gerekli. Lütfen giriş yapın.";
        }
        window.showModal("AI Hatası!", errorMessage + " Lütfen API anahtarınızı, internetinizi veya Cloud Functions ayarlarınızı kontrol edin."); // Daha kısa mesaj
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
        if (typeof functions === 'undefined' || !functions.httpsCallable) {
            throw new Error("Firebase Functions SDK yüklenmemiş veya başlatılmamış.");
        }
        const callImageAI = httpsCallable(functions, 'callImageGenerationAI');
        const result = await callImageAI({ promptText: promptText });
        return result.data.imageUrl;
    } catch (error) {
        console.error("Gemini Görsel Oluşturma AI Hatası (Cloud Function):", error);
        let errorMessage = `Görsel oluşturulurken bir sorun oluştu: ${error.message}.`;
        if (error.code === 'unavailable') {
            errorMessage += " Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.";
        } else if (error.code === 'unauthenticated') {
            errorMessage += " Bu işlem için kimlik doğrulama gerekli. Lütfen giriş yapın.";
        }
        window.showModal("Görsel Oluşturma Hatası!", errorMessage);
        return null;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = "none";
    }
};


/**
 * Mevcut kullanıcının Firestore profil referansını döndürür.
 * @returns {import("firebase/firestore").DocumentReference|null} Kullanıcı profil belgesine referans veya null.
 */
window.getUserProfileRef = function() {
    if (typeof firestore === 'undefined' || !currentUserId) {
        console.warn("Firestore veya Kullanıcı ID'si hazır değil. Profil referansı alınamıyor.");
        return null;
    }
    // Modüler doc() kullanımı: doc(db, collectionPath, docId)
    return doc(firestore, 'users', currentUserId);
};

/**
 * Updates user profile in Firestore */
