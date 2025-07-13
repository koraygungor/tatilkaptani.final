const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// index.js


// Sabitler
const IMAGE_DOWNLOAD_COST_PER_IMAGE = 50;
const VIRTUAL_TOUR_COST_PER_MINUTE = 10;
const VIP_PLAN_CHAT_COST = 10;

// Bu dosya sunucu tarafında çalıştığı için DOM elementleri veya tarayıcıya özgü kodlar burada bulunmamalıdır.
// Tüm DOM element tanımları ve tarayıcıya özgü fonksiyonlar public/index.js dosyasına taşınmıştır.

// Örnek bir Firebase Function (HTTP Callable Function)
exports.sendCompanionMessage = functions.https.onCall(async (data, context) => {
    // Kullanıcının kimliği doğrulanmış mı kontrol et
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const message = data.message;
    const companionId = data.companionId;

    if (!message || !companionId) {
        throw new functions.https.HttpsError('invalid-argument', 'Message and companionId are required.');
    }

    try {
        // Burada AI yoldaş ile etkileşim mantığı olacak
        // Örneğin, bir AI API'sine istek gönderme ve yanıtı işleme
        const aiResponse = `AI Yoldaşınız ${companionId} şöyle yanıtladı: ${message}`;

        // Sohbet geçmişini Firestore'a kaydetme (isteğe bağlı)
        await db.collection('users').doc(userId).collection('companions').doc(companionId).collection('chatHistory').add({
            sender: 'user',
            message: message,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        await db.collection('users').doc(userId).collection('companions').doc(companionId).collection('chatHistory').add({
            sender: 'ai',
            message: aiResponse,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { response: aiResponse };
    } catch (error) {
        console.error('Error sending companion message:', error);
        throw new functions.https.HttpsError('internal', 'Unable to send companion message', error.message);
    }
});

// Diğer sunucu tarafı fonksiyonlarınız buraya eklenebilir.
// Örneğin, kullanıcı profili güncelleme fonksiyonu:
exports.updateUserProfile = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const updates = data.updates;

    if (!updates || typeof updates !== 'object') {
        throw new functions.https.HttpsError('invalid-argument', 'Updates object is required.');
    }

    try {
        await db.collection('users').doc(userId).update(updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new functions.https.HttpsError('internal', 'Unable to update user profile', error.message);
    }
});

// Admin mesajını güncelleme fonksiyonu
exports.updateAdminMessage = functions.https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) { // Admin yetkisi kontrolü
        throw new functions.https.HttpsError('permission-denied', 'Only admins can update the message.');
    }

    const message = data.message;

    if (typeof message !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Message must be a string.');
    }

    try {
        await db.collection('admin').doc('message').set({ text: message });
        return { success: true };
    } catch (error) {
        console.error('Error updating admin message:', error);
        throw new functions.https.HttpsError('internal', 'Unable to update admin message', error.message);
    }
});

// Admin mesajını okuma fonksiyonu
exports.getAdminMessage = functions.https.onCall(async (data, context) => {
    try {
        const doc = await db.collection('admin').doc('message').get();
        if (doc.exists) {
            return { message: doc.data().text };
        } else {
            return { message: 'No admin message set.' };
        }
    } catch (error) {
        console.error('Error getting admin message:', error);
        throw new functions.https.HttpsError('internal', 'Unable to get admin message', error.message);
    }
});

// Sanal tur hediye fotoğrafını e-posta ile gönderme fonksiyonu
exports.sendVirtualImageEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const imageUrl = data.imageUrl;
    const userEmail = data.userEmail;

    if (!imageUrl || !userEmail) {
        throw new functions.https.HttpsError('invalid-argument', 'Image URL and user email are required.');
    }

    // E-posta gönderme mantığı buraya eklenecek (örneğin SendGrid, Nodemailer ile)
    // Bu kısım için ek bir kütüphane (örn. nodemailer) kurmanız ve yapılandırmanız gerekebilir.
    console.log(`Sending email to ${userEmail} with image: ${imageUrl}`);

    return { success: true, message: 'Email sent successfully (simulated).' };
});

// AI Fotoğraf Stüdyosu için görüntü oluşturma fonksiyonu
exports.generateAiPhoto = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const prompt = data.prompt;
    const style = data.style;
    const count = data.count;

    if (!prompt || !style || !count) {
        throw new functions.https.HttpsError('invalid-argument', 'Prompt, style, and count are required.');
    }

    // Burada bir görüntü oluşturma API'si (örn. DALL-E, Midjourney) ile entegrasyon yapılacak.
    // Bu kısım için harici bir API anahtarı ve entegrasyon kodu gereklidir.
    const generatedImageUrls = [
        'https://via.placeholder.com/150/FF0000/FFFFFF?text=AI+Image+1',
        'https://via.placeholder.com/150/00FF00/FFFFFF?text=AI+Image+2'
    ]; // Örnek URL'ler

    // Kullanıcının puanını düşürme
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found.');
    }

    const currentTatilPuan = userDoc.data().tatilPuanlari || 0;
    const cost = count * IMAGE_DOWNLOAD_COST_PER_IMAGE;

    if (currentTatilPuan < cost) {
        throw new functions.https.HttpsError('failed-precondition', 'Insufficient TatilPuan.');
    }

    await userRef.update({
        tatilPuanlari: admin.firestore.FieldValue.increment(-cost),
        palmCoinHistory: admin.firestore.FieldValue.arrayUnion({
            timestamp: new Date().toISOString(),
            type: 'Harcandı',
            activity: 'AI Fotoğraf Oluşturma',
            amount: cost,
            current: currentTatilPuan - cost // Bu değer tam doğru olmayabilir, client tarafında güncellenmeli
        })
    });

    return { imageUrls: generatedImageUrls };
});

// VIP Planı oluşturma fonksiyonu
exports.generateVipPlan = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const { destination, duration, travelers, budget, type } = data;

    if (!destination || !duration || !travelers || !budget || !type) {
        throw new functions.https.HttpsError('invalid-argument', 'All VIP plan fields are required.');
    }

    // Burada bir AI modeli (örn. GPT-3) ile entegrasyon yapılacak.
    const vipPlanOutput = `AI tarafından oluşturulan VIP Planınız: ${destination} için ${duration} günlük, ${travelers} kişilik, ${budget} bütçeli, ${type} türünde bir seyahat.`;

    // Kullanıcının puanını düşürme (isteğe bağlı, VIP planın maliyeti varsa)
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found.');
    }

    const currentTatilPuan = userDoc.data().tatilPuanlari || 0;
    const cost = VIP_PLAN_CHAT_COST; // VIP plan oluşturma maliyeti

    if (currentTatilPuan < cost) {
        throw new functions.https.HttpsError('failed-precondition', 'Insufficient TatilPuan for VIP plan.');
    }

    await userRef.update({
        tatilPuanlari: admin.firestore.FieldValue.increment(-cost),
        palmCoinHistory: admin.firestore.FieldValue.arrayUnion({
            timestamp: new Date().toISOString(),
            type: 'Harcandı',
            activity: 'VIP Plan Oluşturma',
            amount: cost,
            current: currentTatilPuan - cost
        })
    });

    return { plan: vipPlanOutput };
});

// Niş Tur Talebi oluşturma fonksiyonu
exports.generateNichePlan = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const { topic, details } = data;

    if (!topic || !details) {
        throw new functions.https.HttpsError('invalid-argument', 'Topic and details are required.');
    }

    // Burada niş tur planı oluşturma mantığı olacak
    const nichePlanOutput = `Niş Tur Talebiniz (${topic}): ${details} için özel plan oluşturuluyor.`;

    return { plan: nichePlanOutput };
});

// Sanal Tatil Planı oluşturma fonksiyonu
exports.startVirtualHoliday = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const { city, days, durationMinutes, activities, imagePrompt } = data;

    if (!city || !days || !durationMinutes || !activities || !imagePrompt) {
        throw new functions.https.HttpsError('invalid-argument', 'All virtual holiday fields are required.');
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found.');
    }

    const currentTatilPuan = userDoc.data().tatilPuanlari || 0;
    const cost = durationMinutes * VIRTUAL_TOUR_COST_PER_MINUTE;

    if (currentTatilPuan < cost) {
        throw new functions.https.HttpsError('failed-precondition', 'Insufficient TatilPuan for virtual tour.');
    }

    await userRef.update({
        tatilPuanlari: admin.firestore.FieldValue.increment(-cost),
        palmCoinHistory: admin.firestore.FieldValue.arrayUnion({
            timestamp: new Date().toISOString(),
            type: 'Harcandı',
            activity: 'Sanal Tatil Oluşturma',
            amount: cost,
            current: currentTatilPuan - cost
        })
    });

    // Sanal tur ve görüntü oluşturma mantığı
    const virtualTourDetails = `Sanal Tatiliniz: ${city} şehrinde ${days} gün, ${durationMinutes} dakika sürecek. Aktiviteler: ${activities}.`;
    const virtualImageUrl = `https://via.placeholder.com/300/0000FF/FFFFFF?text=Virtual+Tour+Image+for+${city}`; // Örnek görüntü URL'si

    return { tourDetails: virtualTourDetails, imageUrl: virtualImageUrl };
});

// Zaman Yolculuğu fonksiyonu
exports.startTimeTravel = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const { era, duration, character, focus } = data;

    if (!era || !duration || !character || !focus) {
        throw new functions.https.HttpsError('invalid-argument', 'All time travel fields are required.');
    }

    // Zaman yolculuğu simülasyonu veya hikaye oluşturma mantığı
    const timeTravelOutput = `Zaman Yolculuğunuz: ${era} dönemine ${duration} süreli bir yolculuk. Karakteriniz: ${character}, Odak noktası: ${focus}.`;

    return { output: timeTravelOutput };
});

// Kader Rotası tahmin fonksiyonu
exports.predictDestiny = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const { age, hobby, dream, color } = data;

    if (!age || !hobby || !dream || !color) {
        throw new functions.https.HttpsError('invalid-argument', 'All destiny fields are required.');
    }

    // Kader rotası tahmin mantığı
    const destinyOutput = `Kader Rotanız: ${age} yaşındasınız, hobiniz ${hobby}, hayaliniz ${dream}, renginiz ${color}. Geleceğiniz parlak!`;

    return { output: destinyOutput };
});

// AI Yoldaş oluşturma fonksiyonu
exports.createCompanion = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const { name, personality } = data;

    if (!name || !personality) {
        throw new functions.https.HttpsError('invalid-argument', 'Companion name and personality are required.');
    }

    try {
        const companionRef = await db.collection('users').doc(userId).collection('companions').add({
            name: name,
            personality: personality,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { companionId: companionRef.id, name: name, personality: personality };
    } catch (error) {
        console.error('Error creating companion:', error);
        throw new functions.https.HttpsError('internal', 'Unable to create companion', error.message);
    }
});

// Kullanıcı profilini güncelleme fonksiyonu (public/index.js'den çağrılacak)
exports.updateUserProfile = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const updates = data.updates;

    if (!updates || typeof updates !== 'object') {
        throw new functions.https.HttpsError('invalid-argument', 'Updates object is required.');
    }

    try {
        await db.collection('users').doc(userId).update(updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new functions.https.HttpsError('internal', 'Unable to update user profile', error.message);
    }
});

// İletişim formu gönderme fonksiyonu
exports.sendContactForm = functions.https.onCall(async (data, context) => {
    const { subject, email, message, fileUrl } = data;

    if (!subject || !email || !message) {
        throw new functions.https.HttpsError('invalid-argument', 'Subject, email, and message are required.');
    }

    try {
        await db.collection('contactForms').add({
            subject,
            email,
            message,
            fileUrl: fileUrl || null,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, message: 'Contact form submitted successfully.' };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw new functions.https.HttpsError('internal', 'Unable to submit contact form', error.message);
    }
});
// Bilgi Yarışması (Tatil Avı) sorusu döndüren fonksiyon
exports.startQuiz = functions.https.onCall(async (data, context) => {
    // Giriş kontrolü (giriş yapmamışsa hata verir)
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Giriş yapmanız gerekiyor.');
    }

    // Örnek sabit bir soru
    const soru = "Türkiye'nin başkenti neresidir?";
    const secenekler = ["A) İstanbul", "B) Ankara", "C) İzmir"];

    return {
        soru: soru,
        secenekler: secenekler
    };
});
